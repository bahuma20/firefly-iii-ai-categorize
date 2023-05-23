import {getConfigVariable} from "./util.js";

export default class FireflyService {
    #BASE_URL;
    #PERSONAL_TOKEN;

    constructor() {
        this.#BASE_URL = getConfigVariable("FIREFLY_URL")
        if (this.#BASE_URL.slice(-1) === "/") {
            this.#BASE_URL = this.#BASE_URL.substring(0, this.#BASE_URL.length - 1)
        }

        this.#PERSONAL_TOKEN = getConfigVariable("FIREFLY_PERSONAL_TOKEN")
    }

    async getCategories() {
        const response = await fetch(`${this.#BASE_URL}/api/v1/categories`, {
            headers: {
                Authorization: `Bearer ${this.#PERSONAL_TOKEN}`,
            }
        });

        if (!response.ok) {
            throw new FireflyException(response.status, response, await response.text())
        }

        const data = await response.json();

        const categories = new Map();
        data.data.forEach(category => {
            categories.set(category.attributes.name, category.id);
        });

        return categories;
    }

    async setCategory(transactionId, transactions, categoryId) {
        const tag = getConfigVariable("FIREFLY_TAG", "AI categorized");

        const body = {
            apply_rules: true,
            fire_webhooks: true,
            transactions: [],
        }

        transactions.forEach(transaction => {
            let tags = transaction.tags;
            if (!tags) {
                tags = [];
            }
            tags.push(tag);

            body.transactions.push({
                transaction_journal_id: transaction.transaction_journal_id,
                category_id: categoryId,
                tags: tags,
            });
        })

        const response = await fetch(`${this.#BASE_URL}/api/v1/transactions/${transactionId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${this.#PERSONAL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new FireflyException(response.status, response, await response.text())
        }

        const data = await response.json();
        console.debug("transaction updated", data);
    }
}

class FireflyException extends Error {
    code;
    response;
    body;

    constructor(statusCode, response, body) {
        super(`Error while communicating with Firefly III: ${statusCode} - ${body}`);

        this.code = statusCode;
        this.response = response;
        this.body = body;
    }
}