import Ember from 'ember';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

    init() {
        this._super(...arguments);
        this.set('sentSuccessfully', false);
        this.set('sentUnsuccessfully', false);
        this.set('sending', false);
    },

    actions: {

        send() {
            return Ember.RSVP.resolve()
            .then(() => {
                this.set('sending', true);
                return this.get('ajax').post('https://api.vuplex.com/v1/communication/message', {
                    contentType: 'application/json',
                    data: JSON.stringify({
                        email: this.get('email'),
                        message: this.get('message')
                    })
                });
            })
            .then(() => this.set('sentSuccessfully', true))
            .catch(error => {
                Ember.Logger.error(`An error occurred while sending the contact message: ${error.stack}`);
                this.set('sentUnsuccessfully', true);
            })
            .then(() => this.set('sending', false));
        }
    }
});
