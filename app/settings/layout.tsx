import SettingsLayout from './SettingsLayout'

export { metadata } from './SettingsLayout'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <SettingsLayout>{children}</SettingsLayout>
}
