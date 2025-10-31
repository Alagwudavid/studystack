import AccountSettingsClient from './account/AccountSettingsClient';

// This page is automatically wrapped with ProtectedLayout by the settings layout
export default function SettingsPage() {
    // User data will be passed from the layout context
    return <AccountSettingsClient />;
}
