import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationType } from '../utils/translation.collection';

import * as gettext from 'gettext-parser';

export class PoCompiler implements CompilerInterface {

	public extension = 'po';

	/**
	 * Translation domain
	 */
	public domain = '';

	public constructor(options?: any) { }

	public compile(collection: TranslationCollection): string {
		const data = {
			charset: 'utf-8',
			headers: {
				'mime-version': '1.0',
				'content-type': 'text/plain; charset=utf-8',
				'content-transfer-encoding': '8bit',
			},
			translations: {
				[this.domain]: Object.keys(collection.values).reduce((translations, key) => {
					translations[key] = {
						msgid: key,
						msgstr: collection.get(key),
					};
					return translations;
				}, <any> {}),
			},
		};

		return gettext.po.compile(data, 'utf-8');
	}

	public parse(contents: string): TranslationCollection {
		const collection = new TranslationCollection();

		const po = gettext.po.parse(contents, 'utf-8');
		if (!po.translations.hasOwnProperty(this.domain)) {
			return collection;
		}

		const values = Object.keys(po.translations[this.domain])
			.filter(key => key.length > 0)
			.reduce((values, key) => {
				values[key] = po.translations[this.domain][key].msgstr.pop();
				return values;
			}, <TranslationType> {});

		return new TranslationCollection(values);
	}

}
