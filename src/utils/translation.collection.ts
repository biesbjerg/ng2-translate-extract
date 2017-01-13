export interface TranslationType {
	[key: string]: string
};

export class TranslationCollection {

	public values: TranslationType = {};

	public constructor(values: TranslationType = {}) {
		this.values = values;
	}

	public add(key: string, val: string = ''): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, { [key]: val }));
	}

	public addKeys(keys: string[]): TranslationCollection {
		const values = keys.reduce((results, key) => {
			results[key] = '';
			return results;
		}, <TranslationType> {});
		return new TranslationCollection(Object.assign({}, this.values, values));
	}

	public remove(key: string): TranslationCollection {
		return this.filter(k => key !== k);
	}

	public forEach(callback: (key?: string, val?: string) => void): TranslationCollection {
		Object.keys(this.values).forEach(key => callback.call(this, key, this.values[key]));
		return this;
	}

	public filter(callback: (key?: string, val?: string) => boolean): TranslationCollection {
		let values: TranslationType = {};
		this.forEach((key: string, val: string) => {
			if (callback.call(this, key, val)) {
				values[key] = val;
			}
		});
		return new TranslationCollection(values);
	}

	public union(collection: TranslationCollection): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, collection.values));
	}

	public intersect(collection: TranslationCollection): TranslationCollection {
		let values: TranslationType = {};
		this.filter(key => collection.has(key))
			.forEach((key: string, val: string) => {
				values[key] = val;
			});

		return new TranslationCollection(values);
	}

	public has(key: string): boolean {
		return this.values.hasOwnProperty(key);
	}

	public get(key: string): string {
		return this.values[key];
	}

	public keys(): string[] {
		return Object.keys(this.values);
	}

	public count(): number {
		return Object.keys(this.values).length;
	}

	public isEmpty(): boolean {
		return Object.keys(this.values).length === 0;
	}

	public sort(compareFn?: (a: string, b: string) => number): TranslationCollection {
		if (!compareFn) {
			// if no compare functions is provided use a case insensitive sorting function
			compareFn = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());
		}

		let collection = new TranslationCollection();
		let sortedKeys = this.keys().sort(compareFn);
		sortedKeys.forEach((key) => {
			collection = collection.add(key, this.get(key));
		});
		return collection;
	}
}
