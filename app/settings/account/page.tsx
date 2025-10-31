import AccountSettingsClient from './AccountSettingsClient';

// This page is automatically wrapped with ProtectedLayout by the settings layout
export default function AccountSettingsPage() {
    // User data will be passed from the layout context
    return <AccountSettingsClient />;
}
