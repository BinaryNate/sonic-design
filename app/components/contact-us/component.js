import Ember from 'ember';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const delay = ms => new Ember.RSVP.Promise((res) => setTimeout(res, ms));

export default Ember.Component.extend({
    ajax: Ember.inject.service(),

    emailIsValid: Ember.computed('email', function() { return EMAIL_REGEX.test(this.get('email')); }),
    messageIsValid: Ember.computed('message', function() {
        let message = this.get('message');
        return (typeof message === 'string') && message.trim();
    }),
    readyToSend: Ember.computed.and('emailIsValid', 'messageIsValid'),
    editMode: Ember.computed('sending', 'sentSuccessfully', 'sentUnsuccessfully', function() {
        return !(this.get('sending') || this.get('sentSuccessfully') || this.get('sentUnsuccessfully'));
    }),
    sentSuccessfully: true,
    actions: {
        send() {
            this.set('sending', true);
            return delay(2000)
            .then(() => this.set('sending', false));
            // let data = {
            //     email: this.get('email'),
            //     message: this.get('message')
            // };

            // return this.get('ajax').post('/api/v2/contactMessages', { data })
        }
    }
});
