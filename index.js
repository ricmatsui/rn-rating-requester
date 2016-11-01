import React, { Platform, Alert, Linking } from 'react-native';

import RatingsData from './RatingsData';

const _config = {
	title: 'Rate Me',
	message: 'We hope you\'re loving our app. If you are, would you mind taking a quick moment to leave us a positive review?',
	iOSAppStoreId: null,
	androidAppStoreId: null,
	actionLabels: {
		accept: 'Rate',
		delay: 'Remind me later',
		decline: 'No, thanks',
	},
	eventsUntilPrompt: 1,
	usesUntilPrompt: 1,
	daysBeforeReminding: 1,
	debug: false,
};

async function _isAwaitingRating() {
	let timestamps = await RatingsData.getActionTimestamps();
	let rated = timestamps[0];
	let declined = timestamps[1];
	let daysSinceLastSeen = Math.floor((Date.now() - parseInt(timestamps[2]))/1000/60/60/24);
	if (!_config.debug && [rated,declined].every((time) => time[1] !== null)) {
		return false;
	}

	let usesCount = await RatingsData.getUsesCount();
	let eventCounts = await RatingsData.getEventCount();

	return _config.debug || usesCount >= _config.usesUntilPrompt || eventCounts >= _config.eventsUntilPrompt || daysSinceLastSeen > _config.daysBeforeReminding;
}

/**
 * Creates the RatingRequestor object you interact with
 * @class
 */
export default class RatingRequestor {

	/**
	 * @param  {string} iOSAppStoreId - Required. The iOS ID used in the app's respective app store
	 * @param  {string} androidAppStoreId - Required. The android ID used in the app's respective app store
	 * @param  {object} options - Optional. Override the defaults. Takes the following shape, with all elements being optional:
	 * 								{
	 * 									title: {string},
	 * 									message: {string},
	 * 									actionLabels: {
	 * 										decline: {string},
	 * 										delay: {string},
	 * 										accept: {string}
	 * 									},
	 *									eventsUntilPrompt: {number},
	 *									usesUntilPrompt: {number},
	 *									daysBeforeReminding: {number},
	 *									debug: {bool},
	 * 								}
	 */
	constructor(iOSAppStoreId, androidAppStoreId, options) {
		// Check for required options
		if (!iOSAppStoreId || !androidAppStoreId) {
			throw 'You must specify your app\'s store ID on construction to use the Rating Requestor.';
		}

		// Merge defaults with user-supplied config
		Object.assign(_config, options);
		_config.iOSAppStoreId = iOSAppStoreId;
		_config.androidAppStoreId = androidAppStoreId;
	}

	/**
	 * Shows the rating dialog when called. Normally called by `handlePositiveEvent()`, but
	 * can be called on its own as well. Use caution when doing so--you don't want to ask
	 * the user for a rating too frequently or you might annoy them. (This is handy, however,
	 * if the user proactively seeks out something in your app to leave a rating, for example.)
	 *
	 * @param {function(didAppear: boolean, result: string)} callback Optional. Callback that reports whether the dialog appeared and what the result was.
	 */
	async showRatingDialog(callback = () => {}) {
		await RatingsData.recordRatingSeen();

		let storeUrl = Platform.OS === 'ios' ?
			'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=' + _config.iOSAppStoreId + '&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8' :
			'market://details?id=' + _config.androidAppStoreId;

		Alert.alert(
			_config.title, 
			_config.message, 
			[
				{ text: _config.actionLabels.accept, onPress: () => { 
					RatingsData.recordRated(); 
					callback(true, 'accept');
					Linking.openURL(storeUrl);
				} },
				{ text: _config.actionLabels.delay, onPress: () => { callback(true, 'delay'); } },
				{ text: _config.actionLabels.decline, onPress: () => { RatingsData.recordDecline(); callback(true, 'decline'); } },
			]
		);
		// clear the events and uses
		await RatingsData.clearKeys();
	}
	async checkToShowDialog(callback = () => {}) {
		if (await _isAwaitingRating()) {
			this.showRatingDialog(callback);
		} else callback(false);
	}
	async handleUse(callback) {
		await RatingsData.incrementUsesCount();
		await this.checkToShowDialog(callback);
	}
	/**
	 * Call when a positive interaction has occurred within your application. Depending on the number
	 * of times this has occurred and your timing function, this may display a rating request dialog.
	 *
	 * @param {function(didAppear: boolean, result: string)} callback Optional. Callback that reports whether the dialog appeared and what the result was.
	 */
	async handlePositiveEvent(callback) {
		await RatingsData.incrementEventCount();
		await this.checkToShowDialog(callback)
	}
}
