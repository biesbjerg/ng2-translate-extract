import { expect } from 'chai';

import { PipeParser } from '../../src/parsers/pipe.parser';

describe('PipeParser', () => {

	const templateFilename: string = 'test.template.html';

	let parser: PipeParser;

	beforeEach(() => {
		parser = new PipeParser();
	});

	it('should only extract string using pipe', () => {
		const contents = `<button [style.background]="'lime'">{{ 'SomeKey_NotWorking' | translate }}</button>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['SomeKey_NotWorking']);
	});

	it('should extract string using pipe, but between quotes only', () => {
		const contents = `<input class="form-control" type="text" placeholder="{{'user.settings.form.phone.placeholder' | translate}}" [formControl]="settingsForm.controls['phone']">`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['user.settings.form.phone.placeholder']);
	});

	it('should extract interpolated strings using translate pipe', () => {
		const contents = `Hello {{ 'World' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings with escaped quotes', () => {
		const contents = `Hello {{ 'World\\'s largest potato' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`World's largest potato`]);
	});

	it('should extract interpolated strings using translate pipe in attributes', () => {
		const contents = `<span attr="{{ 'Hello World' | translate }}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract bound strings using translate pipe in attributes', () => {
		const contents = `<span [attr]="'Hello World' | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should not use a greedy regular expression', () => {
		const contents = `
			<ion-header>
				<ion-navbar color="brand">
					<ion-title>{{ 'Info' | translate }}</ion-title>
				</ion-navbar>
			</ion-header>

			<ion-content>

				<content-loading *ngIf="isLoading">
					{{ 'Loading...' | translate }}
				</content-loading>

			</ion-content>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Info', 'Loading...']);
	});

	it('should extract strings on same line', () => {
		const contents = `<span [attr]="'Hello' | translate"></span><span [attr]="'World' | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from this template', () => {
		const contents = `
			<ion-list inset>
				<ion-item>
					<ion-icon item-left name="person" color="dark"></ion-icon>
					<ion-input formControlName="name" type="text" [placeholder]="'Name' | translate"></ion-input>
				</ion-item>
				<ion-item>
					<p color="danger" danger *ngFor="let error of form.get('name').getError('remote')">
						{{ error }}
					</p>
				</ion-item>
			</ion-list>
			<div class="form-actions">
				<button ion-button (click)="onSubmit()" color="secondary" block>{{ 'Create account' | translate }}</button>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Name', 'Create account']);
	});

});
