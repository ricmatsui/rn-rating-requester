'use strict';

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import RatingRequestor, { RatingsData } from 'rn-rating-requestor';

const ratingsConfig = {
  callbacks: {
    notEnjoyingApp: () => {
      Alert.alert(
        'Feedback?',
        'We appreciate your opinion. Would you give use some feedback about how we can improve?',
        [
          { text: 'Sure!' },
          { text: 'No, thanks', style: 'cancel' },
        ],
      );
    }
  },
  eventsUntilPrompt: 3,
};

const RatingTracker = new RatingRequestor('123456789', '123456789', ratingsConfig);

export default class RatingRequestorExample extends Component {
  constructor() {
    super()
    this.state = {
      // Note: this has nothing to do with the tracker, it's just a convenience so we can show
      // on the screen how many times we've pressed the button.
      happyInteractions: 0,
    };

    this._handlePositivePress = this._handlePositivePress.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Ratings Requestor Example
        </Text>
        <Text style={styles.instructions}>
          Press the button below 3, 9, 27, etc., times to trigger the ratings prompt.
          The prompt will not appear again if you select "No thanks" or "Sure."
          (Note: to reset the counter if you decline/rate, you'll need to remove the app and reinstall.)
        </Text>
        <TouchableOpacity style={styles.button} onPress={this._handlePositivePress}>
          <Text style={styles.buttonText}>
            Tap me for awesomeness!
          </Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>
          You've triggered {this.state.happyInteractions} happy interactions.
        </Text>
        <TouchableOpacity style={styles.altButton} onPress={this._handleImmediateDialogDisplay}>
          <Text style={styles.buttonText}>
            Force the dialog to show (use with caution!)
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _handlePositivePress() {
    RatingTracker.handlePositiveEvent();
    this.setState({
      // Again, this state variable has nothing to do with the tracker, it's just for visualization.
      happyInteractions: this.state.happyInteractions + 1
    });
  }

  _handleImmediateDialogDisplay() {
    RatingTracker.showRatingDialog();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginHorizontal: 20,
    marginVertical: 25
  },
  button: {
    backgroundColor: '#38ADC6',
    borderColor: '#3095AB',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10
  },
  altButton: {
    backgroundColor: '#fc8265',
    borderColor: '#de5740',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginTop: 60
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
