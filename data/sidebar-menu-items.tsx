// Custom SVG Icons

//HOME
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const ActiveHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m5 9.625l-1.538 1.198q-.178.135-.366.104q-.188-.03-.323-.208q-.135-.177-.11-.365q.023-.189.195-.323l8.148-6.26q.224-.162.478-.242q.254-.081.519-.081t.517.08t.474.243l8.154 6.26q.171.134.193.326q.02.191-.114.362q-.135.171-.323.202t-.36-.104L12 4.294L6 8.87v8.516q0 .269.173.442t.443.173h3.634q.213 0 .356.144t.144.357t-.144.356t-.356.143H6.616q-.667 0-1.141-.475T5 17.386zm8.789 13.106q-.192 0-.317-.125t-.126-.317t.126-.317t.317-.126h1.405q-.823-.713-1.335-1.71q-.513-.996-.513-2.098q0-1.429.758-2.57t1.992-1.697q.179-.087.33-.01t.218.237t.016.332t-.273.276q-.952.463-1.554 1.378t-.602 2.054q0 .918.445 1.754t1.17 1.446v-1.45q0-.191.125-.317t.317-.125t.317.125t.126.317v2.135q0 .343-.232.575t-.576.233zm5.967-.425q-.179.086-.333 0q-.154-.087-.221-.247q-.068-.159-.016-.331t.273-.276q.972-.488 1.564-1.4t.593-2.013q0-.918-.446-1.754q-.445-.837-1.17-1.447v1.45q0 .192-.125.317q-.125.126-.316.126t-.318-.126t-.126-.317v-2.134q0-.344.232-.576q.233-.232.576-.232h2.135q.191 0 .317.125q.125.125.125.316t-.125.318t-.317.126h-1.406q.823.713 1.335 1.71q.513.995.513 2.097q0 1.43-.758 2.57q-.758 1.142-1.986 1.698"></path></svg>
);
const LessonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.25 7A.75.75 0 0 1 8 6.25h8a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 7M8 9.75a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z"></path><path fill="currentColor" fillRule="evenodd" d="M9.945 1.25c-1.367 0-2.47 0-3.337.117c-.9.12-1.658.38-2.26.981c-.602.602-.86 1.36-.981 2.26c-.117.867-.117 1.97-.117 3.337v8.11c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h4.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-8.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26s-1.36-.86-2.26-.981c-.867-.117-1.97-.117-3.337-.117zM5.41 3.409c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h4c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v7.25H7.782c-.818 0-1.376 0-1.855.128a3.8 3.8 0 0 0-1.177.548V8c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399m-.632 14.84c.015.354.039.665.076.943c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h4c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.083-.615.099-1.395.102-2.441H7.898c-.978 0-1.32.006-1.583.077a2.25 2.25 0 0 0-1.538 1.422" clipRule="evenodd"></path></svg>
);

const WatchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M168 120a12 12 0 0 1-5.12 9.83l-40 28A12 12 0 0 1 104 148V92a12 12 0 0 1 18.88-9.83l40 28A12 12 0 0 1 168 120m68-56v112a28 28 0 0 1-28 28H48a28 28 0 0 1-28-28V64a28 28 0 0 1 28-28h160a28 28 0 0 1 28 28m-24 0a4 4 0 0 0-4-4H48a4 4 0 0 0-4 4v112a4 4 0 0 0 4 4h160a4 4 0 0 0 4-4Zm-52 152H96a12 12 0 0 0 0 24h64a12 12 0 0 0 0-24"></path></svg>
    // <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M168 224a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m64-160v112a24 24 0 0 1-24 24H48a24 24 0 0 1-24-24V64a24 24 0 0 1 24-24h160a24 24 0 0 1 24 24m-68 56a8 8 0 0 0-3.41-6.55l-40-28A8 8 0 0 0 108 92v56a8 8 0 0 0 12.59 6.55l40-28A8 8 0 0 0 164 120"></path></svg>
);

const ExploreIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M2.05 11q.375-3.8 3.2-6.4T12 2q2.075 0 3.888.788t3.174 2.15t2.15 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22q-1.325 0-2.575-.325T7.05 20.7q-.45-.25-.5-.725t.35-.875q.225-.225.575-.275t.625.125q.925.5 1.9.775T12 20q3.325 0 5.663-2.338T20 12t-2.337-5.663T12 4Q8.925 4 6.675 6.013T4.05 11q-.05.425-.337.713T3 12t-.712-.3t-.238-.7m13.95.4V13q0 .425.288.713T17 14t.713-.288T18 13V9q0-.425-.288-.712T17 8h-4q-.425 0-.712.288T12 9t.288.713T13 10h1.6l-3.65 3.65l-2.3-1.925q-.3-.25-.687-.225t-.663.3l-3.825 3.825q-.25.25-.288.588t.138.637q.25.425.725.475t.825-.3L8.05 13.85l2.3 1.925q.3.25.688.225t.662-.3z"></path></svg>
    //active
    // <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.5 0-4.587-1.1T3.95 17.95l4.1-4.1l2.3 1.925q.3.25.688.225t.662-.3l4.3-4.3V13q0 .425.288.712T17 14t.713-.288T18 13V9q0-.425-.288-.712T17 8h-4q-.425 0-.712.288T12 9t.288.713T13 10h1.6l-3.65 3.65l-2.3-1.925q-.3-.25-.687-.225t-.663.3l-4.4 4.4q-.425-.95-.662-2.013T2 12q0-2.075.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path></svg>
);

const ClassRoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 2A2.75 2.75 0 0 1 20 4.75v14.5A2.75 2.75 0 0 1 17.25 22H6.75A2.75 2.75 0 0 1 4 19.249V4.75c0-1.26.846-2.32 2-2.647V3.75c-.304.228-.5.59-.5 1v14.498c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V4.75c0-.69-.56-1.25-1.25-1.25H15V2zM14 2v8.139c0 .747-.8 1.027-1.29.764l-.082-.052l-2.126-1.285l-2.078 1.251c-.5.36-1.33.14-1.417-.558L7 10.14V2zm-1.5 1.5h-4v5.523l1.573-.949a.92.92 0 0 1 .818-.024l1.61.974z"></path></svg>
);
const ActiveClassRoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.15V10q0-.8.588-1.35t1.387-.5q1.975.3 3.763 1.163T12 11.55q1.475-1.375 3.263-2.238t3.762-1.162q.8-.05 1.388.5T21 10v7.15q0 .8-.525 1.363t-1.325.612q-1.6.25-3.1.825t-2.8 1.525q-.275.225-.587.337t-.663.113t-.663-.112t-.587-.338q-1.3-.95-2.8-1.525t-3.1-.825q-.8-.05-1.325-.612T3 17.15M12 9q-1.65 0-2.825-1.175T8 5t1.175-2.825T12 1t2.825 1.175T16 5t-1.175 2.825T12 9" /></svg>
);

const FeaturedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M44 28H28v16h16zM13 4l9 16H4zm23 16a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z" /><path strokeLinecap="round" d="m4 28l16 16m0-16L4 44" /></g></svg>
);


const DiscussionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinejoin="round" d="M14.17 20.89c4.184-.277 7.516-3.657 7.79-7.9c.053-.83.053-1.69 0-2.52c-.274-4.242-3.606-7.62-7.79-7.899a33 33 0 0 0-4.34 0c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184c.467.845.159 1.9-.328 2.823c-.35.665-.526.997-.385 1.237c.14.24.455.248 1.084.263c1.245.03 2.084-.322 2.75-.813c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34c1.425.094 2.914.094 4.342 0Z"></path><path strokeLinecap="round" d="M10.5 9.538C10.5 8.688 11.172 8 12 8s1.5.689 1.5 1.538c0 .307-.087.592-.238.832c-.448.714-1.262 1.396-1.262 2.245V13"></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 15h.009"></path></g></svg>
);

const OfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M14 22V8c0-2.828 0-4.243-.879-5.121C12.243 2 10.828 2 8 2s-4.243 0-5.121.879C2 3.757 2 5.172 2 8v8c0 2.828 0 4.243.879 5.121C3.757 22 5.172 22 8 22zM6.5 11h-1m5 0h-1m-3-4h-1m1 8h-1m5-8h-1m1 8h-1m9 0h-1m1-4h-1m.5-3h-4v14h4c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-6c0-1.886 0-2.828-.586-3.414S19.886 8 18 8Z" /></svg>
);

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>

);

const DiscoverIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><circle cx={12} cy={12} r={9}></circle><path d="M11.307 9.739L15 9l-.739 3.693a2 2 0 0 1-1.568 1.569L9 15l.739-3.693a2 2 0 0 1 1.568-1.568"></path></g></svg>
);

const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
);

const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z" /></svg>
);

const ChallengeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3h2l5 2l-5 2v3.17L22 21H2l6-8l3.5 4.7l3.5-7.53z" /></svg>
);

const ArenaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.39 4.39a1 1 0 0 0 1.68-.474a2.5 2.5 0 1 1 3.014 3.015a1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474a2.5 2.5 0 1 0-3.014 3.015a1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474a2.5 2.5 0 1 1-3.014-3.015a1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474a2.5 2.5 0 1 0 3.014-3.015a1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"></path></svg>
);

const CommunityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 18v-1a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v1M1 18v-1a3 3 0 0 1 3-3v0m19 4v-1a3 3 0 0 0-3-3v0m-8-2a3 3 0 1 0 0-6a3 3 0 0 0 0 6m-8 2a2 2 0 1 0 0-4a2 2 0 0 0 0 4m16 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4" /></svg>
);

const OpportunitiesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M6.99 4.564c-1.843-.64-2.93-.796-3.576-.15c-.923.924-.21 2.745 1.216 6.389l2.36 6.033c1.362 3.48 2.043 5.22 3.123 5.163c1.08-.058 1.576-1.874 2.566-5.506c.295-1.081.442-1.622.817-1.997s.916-.522 1.997-.817c3.632-.99 5.448-1.486 5.506-2.566c.044-.826-.964-1.419-2.999-2.261"></path><path d="M11.5 4A5.92 5.92 0 0 0 15 7.5a5.92 5.92 0 0 0-3.5 3.5A5.92 5.92 0 0 0 8 7.5A5.92 5.92 0 0 0 11.5 4m4.25-2A2.11 2.11 0 0 0 17 3.25a2.11 2.11 0 0 0-1.25 1.25a2.12 2.12 0 0 0-1.25-1.25A2.12 2.12 0 0 0 15.75 2"></path></g></svg>
);

const CoursesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.502 14.25a1.75 1.75 0 0 0-1.75-1.75h-2a1.75 1.75 0 0 0-1.75 1.75v2c0 .966.784 1.75 1.75 1.75h2a1.75 1.75 0 0 0 1.75-1.75zM7.752 14h2a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25h-2a.25.25 0 0 1-.25-.25v-2a.25.25 0 0 1 .25-.25M18 14.25a1.75 1.75 0 0 0-1.75-1.75h-2a1.75 1.75 0 0 0-1.75 1.75v2c0 .966.783 1.75 1.75 1.75h2A1.75 1.75 0 0 0 18 16.25zM14.25 14h2a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25h-2a.25.25 0 0 1-.25-.25v-2a.25.25 0 0 1 .25-.25M11.5 7.75A1.75 1.75 0 0 0 9.751 6h-2a1.75 1.75 0 0 0-1.75 1.75v2c0 .966.783 1.75 1.75 1.75h2a1.75 1.75 0 0 0 1.75-1.75zM7.75 7.5h2a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25h-2a.25.25 0 0 1-.25-.25v-2a.25.25 0 0 1 .25-.25m10.247.25A1.75 1.75 0 0 0 16.248 6h-2a1.75 1.75 0 0 0-1.75 1.75v2c0 .966.784 1.75 1.75 1.75h2a1.75 1.75 0 0 0 1.75-1.75zm-3.75-.25h2a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25h-2a.25.25 0 0 1-.25-.25v-2a.25.25 0 0 1 .25-.25M6.25 3A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3zM4.5 6.25c0-.966.784-1.75 1.75-1.75h11.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75z"></path></svg>
);

const SpacesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    // <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2}><path d="M12 8v3m0 0v3m0-3h3m-3 0H9"></path><path strokeLinejoin="round" d="M14 19c3.771 0 5.657 0 6.828-1.172S22 14.771 22 11s0-5.657-1.172-6.828S17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172S2 7.229 2 11s0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07"></path><path d="M14 19c-1.236 0-2.598.5-3.841 1.145c-1.998 1.037-2.997 1.556-3.489 1.225s-.399-1.355-.212-3.404L6.5 17.5"></path></g></svg>
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"></path></g></svg>
);

const CommunitiesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2s-.89 2-2 2s-2-.89-2-2M4 2v2h14V2zm0 4v2h14V4zm0 4v2h14V8zm0 4v2h14v-2zm0 4v2h14v-2z" /></svg>
);

const GroupsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0"></path><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"></path></g></svg>
);

const FollowingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    // <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z" /></svg>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0"></path><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"></path></g></svg>
);

const EventsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V8h14zm-3-9h-2v2h2zm0 4h-2v2h2zm-4-4H8v2h4zm0 4H8v2h4z" /></svg>
);

const PeopleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 16 16"><path fill="currentColor" d="M5.5 5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m0 5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m-1-8A1.5 1.5 0 0 0 3 3.5v10a.5.5 0 0 0 .5.5h2.796a3.3 3.3 0 0 1-.273-1H4V3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v2.187c.31-.12.647-.187 1-.187v-2A1.5 1.5 0 0 0 8.5 2zm3 3a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1M6 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m5.75 1.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0m3.5.5a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M13 12.6c0 1.184-.8 2.4-3 2.4s-3-1.216-3-2.4A1.6 1.6 0 0 1 8.6 11h2.8a1.6 1.6 0 0 1 1.6 1.6m.704 1.4h.046c1.65 0 2.25-.912 2.25-1.8a1.2 1.2 0 0 0-1.2-1.2h-1.35c.345.441.55.997.55 1.6c0 .462-.09.946-.296 1.4"></path></svg>
);
const ActivePeopleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v10a.5.5 0 0 0 .5.5h2.796A3.4 3.4 0 0 1 6 12.6c0-1.211.828-2.229 1.95-2.518A2.75 2.75 0 0 1 10 5.5v-2A1.5 1.5 0 0 0 8.5 2zm1 3a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m0 2.5a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m0 2.5a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m2-5a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m4.25 3.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0m3.5.5a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M13 12.6c0 1.184-.8 2.4-3 2.4s-3-1.216-3-2.4A1.6 1.6 0 0 1 8.6 11h2.8a1.6 1.6 0 0 1 1.6 1.6m.704 1.4h.046c1.65 0 2.25-.912 2.25-1.8a1.2 1.2 0 0 0-1.2-1.2h-1.35c.345.441.55.997.55 1.6c0 .462-.09.946-.296 1.4"></path></svg>
);

const QuickSaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3zm3-10H5V5h10z" /></svg>
);

const ReadLaterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z" /></svg>
);

const UserAvatarIcon = (props: React.SVGProps<SVGSVGElement> & { user?: any }) => {
    // If we have user data with an avatar, this will be handled by the component itself
    // This is just a fallback icon
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
        </svg>
    );
};

const ResourcesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 32 32"><path fill="currentColor" d="M4 8.5V11h6.464a1.5 1.5 0 0 0 1.061-.44l2.06-2.06l-2.06-2.06a1.5 1.5 0 0 0-1.06-.44H6.5A2.5 2.5 0 0 0 4 8.5m-2 0A4.5 4.5 0 0 1 6.5 4h3.964a3.5 3.5 0 0 1 2.475 1.025L15.414 7.5H25.5A4.5 4.5 0 0 1 30 12v4.292a9 9 0 0 0-2-1.357V12a2.5 2.5 0 0 0-2.5-2.5H15.414l-2.475 2.475A3.5 3.5 0 0 1 10.464 13H4v10.5A2.5 2.5 0 0 0 6.5 26h9.012c.252.712.59 1.383 1.003 2H6.5A4.5 4.5 0 0 1 2 23.5zm22 22a7.5 7.5 0 1 0 0-15a7.5 7.5 0 0 0 0 15m1-12.25V22h3.75a.75.75 0 0 1 0 1.5H25v3.75a.75.75 0 0 1-1.5 0V23.5h-3.75a.75.75 0 0 1 0-1.5h3.75v-3.75a.75.75 0 0 1 1.5 0"></path></svg>
);

const NotificationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

import { Search, Star, Hash, Globe, Trophy, HeartIcon, PlusSquareIcon } from "lucide-react";

export interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    disabled: boolean;
}


export const sidebarMenuItems: MenuItem[] = [
    {
        id: "home",
        label: "Home",
        icon: HomeIcon,
        activeIcon: ActiveHomeIcon,
        href: "/home",
        disabled: false,
    },
    {
        id: "videos",
        label: "Videos",
        icon: WatchIcon,
        href: "/#videos",
        disabled: false,
    },
    {
        id: "discover",
        label: "Discover",
        icon: DiscoverIcon,
        href: "/discover",
        disabled: false,
    },
    {
        id: "chat",
        label: "Chat",
        icon: ChatIcon,
        href: "/create-post",
        disabled: false,
    },
    {
        id: "questions",
        label: "Questions",
        icon: DiscussionIcon,
        // activeIcon: ActivePeopleIcon,
        href: "/#",
        disabled: false,
    },
    {
        id: "notifications",
        label: "Activities",
        icon: NotificationIcon,
        activeIcon: NotificationIcon,
        href: "/activities",
        disabled: false,
    },
    {
        id: "communities",
        label: "Communities",
        icon: CommunityIcon,
        href: "/create-post",
        disabled: false,
    },
    {
        id: "following",
        label: "Following",
        icon: FollowingIcon,
        href: "/#",
        disabled: false,
    },
    // {
    //     id: "events",
    //     label: "Events",
    //     icon: EventsIcon,
    //     href: "/#",
    //     disabled: false,
    // },
    // {
    //     id: "arena",
    //     label: "Arena",
    //     icon: ArenaIcon,
    //     activeIcon: ArenaIcon,
    //     href: "/#",
    //     disabled: false,
    // },
    {
        id: "opportunities",
        label: "Opportunities",
        icon: OpportunitiesIcon,
        activeIcon: OpportunitiesIcon,
        href: "/opportunities",
        disabled: false,
    },
    // {
    //     id: "resources",
    //     label: "Resources",
    //     icon: ResourcesIcon,
    //     href: "/discover",
    //     disabled: false,
    // },
    // {
    //     id: "main-menu",
    //     label: "Profile",
    //     icon: UserAvatarIcon,
    //     activeIcon: UserAvatarIcon,
    //     href: "/main-menu",
    //     disabled: false,
    // },
    {
        id: "Shop",
        label: "Shop",
        icon: CartIcon,
        href: "/#",
        disabled: false,
    },
];


// Explore items
// export const discoverMenuItems: MenuItem[] = [
//     // {
//     //     id: "community",
//     //     label: "Community",
//     //     icon: CommunityIcon,
//     //     href: "/community",
//     //     disabled: false,
//     // },
//     // {
//     //     id: "users",
//     //     label: "Users",
//     //     icon: GroupsIcon,
//     //     href: "/explore/users",
//     //     disabled: false,
//     // // },
//     // {
//     //     id: "questions",
//     //     label: "Questions",
//     //     icon: AnswersIcon,
//     //     href: "/#",
//     //     disabled: false,
//     // // },
//     // {
//     //     id: "companies",
//     //     label: "Companies",
//     //     icon: OfficeIcon,
//     //     activeIcon: OfficeIcon,
//     //     href: "/companies",
//     //     disabled: false,
//     // },
//     // {
//     //     id: "resources",
//     //     label: "Resources",
//     //     icon: ResourcesIcon,
//     //     href: "/discover",
//     //     disabled: false,
//     // },
// ];

// Discover items
// export const exploreMenuItems: MenuItem[] = [
//     {
//         id: "events",
//         label: "Events",
//         icon: EventsIcon,
//         href: "/#",
//         disabled: false,
//     },
//     {
//         id: "marketplace",
//         label: "Marketplace",
//         icon: CartIcon,
//         href: "/#",
//         disabled: false,
//     },
//     {
//         id: "tags",
//         label: "Tags",
//         icon: Hash,
//         href: "/#",
//         disabled: false,
//     },
//     {
//         id: "leaderboard",
//         label: "Leaderboard",
//         icon: Trophy,
//         href: "/leaderboard",
//         disabled: false,
//     },
//     {
//         id: "favourites",
//         label: "Favourites",
//         icon: HeartIcon,
//         href: "/#",
//         disabled: false,
//     },
//     {
//         id: "read-later",
//         label: "Read later",
//         icon: ReadLaterIcon,
//         href: "/#",
//         disabled: false,
//     },
// ];

// // Bookmark items
// export const bookmarkMenuItems: MenuItem[] = [
//     // {
//     //     id: "presidential-briefings",
//     //     label: "Presidential briefings",
//     //     icon: PresidentialIcon,
//     //     href: "/bookmarks/presidential",
//     //     disabled: false,
//     // },
//     {
//         id: "favourites",
//         label: "Favourites",
//         icon: HeartIcon,
//         href: "/bookmarks/favourites",
//         disabled: false,
//     },
//     {
//         id: "read-later",
//         label: "Read it later",
//         icon: ReadLaterIcon,
//         href: "/bookmarks/later",
//         disabled: false,
//     },
// ];