export type formData = {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export type ContactFormResponse = {
    success: boolean;
    message: string;
    errors?: Array<{
        path: string[];
        message: string;
    }>;
}