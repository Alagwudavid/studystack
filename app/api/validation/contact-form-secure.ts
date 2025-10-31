import z from "zod";

// Email blacklist patterns (common spam domains)
const spamDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email'
];

// Profanity filter (basic example)
const profanityWords = ['spam', 'scam', 'hack', 'exploit'];

const containsProfanity = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return profanityWords.some(word => lowerText.includes(word));
};

const isSpamDomain = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return spamDomains.some(spamDomain => domain?.includes(spamDomain));
};

export const contactFormSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name must be less than 100 characters" })
        .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" })
        .refine((name) => !containsProfanity(name), {
            message: "Name contains inappropriate content"
        }),

    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .max(255, { message: "Email must be less than 255 characters" })
        .toLowerCase()
        .refine((email) => !isSpamDomain(email), {
            message: "This email domain is not allowed"
        }),

    subject: z.string()
        .min(1, { message: "Subject is required" })
        .min(5, { message: "Subject must be at least 5 characters long" })
        .max(200, { message: "Subject must be less than 200 characters" })
        .refine((subject) => !containsProfanity(subject), {
            message: "Subject contains inappropriate content"
        }),

    message: z.string()
        .min(1, { message: "Message is required" })
        .min(10, { message: "Message must be at least 10 characters long" })
        .max(1200, { message: "Message must be less than 1200 characters" })
        .refine((message) => !containsProfanity(message), {
            message: "Message contains inappropriate content"
        }),
});

export default contactFormSchema;
