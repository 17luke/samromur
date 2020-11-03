import sgClient from '@sendgrid/client';
import sgMail from '@sendgrid/mail';

import { EmailOptions, getConfig } from '../utilities/config-helper';

export default class EmailClient {
    private emailConfig: EmailOptions;

    constructor() {
        this.emailConfig = getConfig().EMAIL;
        this.init();
    }

    init = async (): Promise<void> => {
        const { SENDGRID_KEY } = this.emailConfig;
        if (!SENDGRID_KEY) {
            return Promise.reject('MISSING_API_KEY');
        }
        sgMail.setApiKey(SENDGRID_KEY);
        sgClient.setApiKey(SENDGRID_KEY);
        return Promise.resolve();
    };

    sendSignupConfirmEmail = async (email: string, url: string) => {
        const { FROM_EMAIL, SIGNUP_TEMPLATE_ID } = this.emailConfig;
        return sgMail.send({
            to: email,
            from: FROM_EMAIL,
            templateId: SIGNUP_TEMPLATE_ID,
            dynamicTemplateData: {
                URL: url,
            },
        });
    };

    sendConsentEmail = async (
        email: string,
        kennitala: string,
        url: string
    ): Promise<void> => {
        const { FROM_EMAIL, CONSENT_TEMPLATE_ID } = this.emailConfig;

        return sgMail
            .send({
                to: email,
                from: FROM_EMAIL,
                templateId: CONSENT_TEMPLATE_ID,
                dynamicTemplateData: {
                    KENNITALA: kennitala,
                    URL: url,
                },
            })
            .then(() => {
                return Promise.resolve();
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    subscribeToNewsletter = async (email: string): Promise<void> => {
        await sgClient.request({
            method: 'PUT',
            url: '/v3/marketing/contacts',
            body: {
                contacts: [
                    {
                        email: email,
                    },
                ],
            },
        });
        return Promise.resolve();
    };
}

let instance: EmailClient;

export function getEmailInstance() {
    return instance || (instance = new EmailClient());
}
