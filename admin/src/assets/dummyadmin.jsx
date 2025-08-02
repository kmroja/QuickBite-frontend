import {
    FiPlusCircle,
    FiList,
    FiPackage, FiTruck, FiCheckCircle, FiClock,
} from 'react-icons/fi';


export const navLinks = [
    { name: 'Add Items', href: '/', icon: <FiPlusCircle /> },
    { name: 'List Items', href: '/list', icon: <FiList /> },
    { name: 'Orders', href: '/orders', icon: <FiPackage /> },
];


// LIST CSS
export const styles = {
    pageWrapper: "min-h-screen bg-gradient-to-br from-[#dfece2] via-[#b9c8ac] to-[#7b8b6f] py-12 px-4 sm:px-6 lg:px-8",
    cardContainer: "bg-[#eef3eb]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-green-700/20",
    title: "text-3xl font-bold mb-8 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent text-center",
    tableWrapper: "overflow-x-auto",
    table: "w-full",
    thead: "bg-[#cbdac6]/60",
    th: "p-4 text-left text-green-800",
    thCenter: "p-4 text-center text-green-800",
    tr: "border-b border-green-800/20 hover:bg-[#a8bfa0]/30 transition-colors",
    imgCell: "p-4",
    img: "w-50 h-30 object-contain rounded-lg",
    nameCell: "p-4",
    nameText: "text-green-900 font-medium text-lg",
    descText: "text-sm text-green-900/70",
    categoryCell: "p-4 text-green-800/80",
    priceCell: "p-4 text-lime-700 font-medium",
    ratingCell: "p-4",
    heartsCell: "p-4",
    heartsWrapper: "flex items-center gap-2 text-green-700",
    deleteBtn: "text-green-700 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-900/20",
    emptyState: "text-center py-12 text-green-900/70 text-xl",

    // AddItems styles
    formWrapper: "min-h-screen bg-gradient-to-br from-[#dfece2] via-[#b9c8ac] to-[#7b8b6f] py-10 px-4 sm:px-6 lg:px-8",
    formCard: "bg-[#eef3eb]/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-green-700/20",
    formTitle: "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent text-center",
    uploadWrapper: "flex justify-center",
    uploadLabel: "w-full max-w-xs sm:w-72 h-56 sm:h-72 bg-[#cbdac6]/50 border-2 border-dashed border-green-600/30 rounded-2xl cursor-pointer flex items-center justify-center overflow-hidden hover:border-green-500 transition-all",
    uploadIcon: "text-3xl sm:text-4xl text-green-700 mb-2 mx-auto animate-pulse",
    uploadText: "text-green-700 text-sm",
    previewImage: "w-full h-full object-cover",
    inputField: "w-full bg-[#cbdac6]/50 border border-green-700/20 rounded-xl px-4 py-3 sm:px-5 sm:py-4 focus:outline-none focus:border-green-500 text-green-900",
    gridTwoCols: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
    relativeInput: "relative",
    rupeeIcon: "absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-lg sm:text-xl",
    actionBtn: "w-full bg-gradient-to-r from-green-700 to-green-900 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 mt-6",

    // AdminNavbar styles
    navWrapper: "bg-[#a0b29f] border-b-8 border-green-800/40 shadow-lg sticky top-0 z-50 font-vibes",
    navContainer: "max-w-7xl mx-auto px-4 flex justify-between items-center h-20",
    logoSection: "flex items-center space-x-3",
    logoIcon: "text-4xl text-green-700",
    logoText: "text-2xl font-bold text-green-900 tracking-wide",
    menuButton: "text-green-700 text-2xl lg:hidden",
    desktopMenu: "hidden lg:flex items-center space-x-4",
    navLinkBase: "flex items-center space-x-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
    navLinkActive: "bg-green-800/30 border-green-600 text-green-100",
    navLinkInactive: "border-green-800/30 text-green-900 hover:border-green-500 hover:bg-green-900/20",
    mobileMenu: "lg:hidden flex flex-col space-y-3 mt-4 pb-4"
};


// DummyData.jsx
export const iconMap = {
    FiClock: <FiClock className="text-lg" />,
    FiTruck: <FiTruck className="text-lg" />,
    FiCheckCircle: <FiCheckCircle className="text-lg" />,
};

export const statusStyles = {
    processing: {
        color: 'text-green-700',
        bg: 'bg-green-900/10',
        icon: 'FiClock',
        label: 'Processing',
        hideLabel: false,
    },
    outForDelivery: {
        color: 'text-lime-600',
        bg: 'bg-lime-900/10',
        icon: 'FiTruck',
        label: 'Out for Delivery',
        hideLabel: false,
    },
    delivered: {
        color: 'text-emerald-600',
        bg: 'bg-emerald-900/10',
        icon: 'FiCheckCircle',
        label: 'Delivered',
        hideLabel: false,
    },
    succeeded: {
        color: 'text-emerald-600',
        bg: 'bg-emerald-900/10',
        icon: 'FiCheckCircle',
        label: 'Completed',
        hideLabel: true,
    },
};

export const paymentMethodDetails = {
    cod: {
        label: 'COD',
        class: 'bg-green-700/30 text-green-200 border-green-500/50',
    },
    card: {
        label: 'Credit/Debit Card',
        class: 'bg-lime-700/30 text-lime-200 border-lime-500/50',
    },
    upi: {
        label: 'UPI Payment',
        class: 'bg-emerald-700/30 text-emerald-200 border-emerald-500/50',
    },
    default: {
        label: 'Online',
        class: 'bg-teal-700/30 text-teal-200 border-teal-500/50',
    },
};

export const tableClasses = {
    wrapper: 'overflow-x-auto',
    table: 'w-full',
    headerRow: 'bg-[#cbdac6]/50',
    headerCell: 'p-4 text-left text-green-800',
    row: 'border-b border-green-800/20 hover:bg-[#a8bfa0]/30 transition-colors group',
    cellBase: 'p-4',
};

export const layoutClasses = {
    page: 'min-h-screen bg-gradient-to-br from-[#dfece2] via-[#b9c8ac] to-[#7b8b6f] py-12 px-4 sm:px-6 lg:px-8',
    card: 'bg-[#eef3eb]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-green-700/20',
    heading: 'text-3xl font-bold mb-8 bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent text-center',
};
