import { ManagementRouteConstant } from "../routing/management-routing-constant.model"
import { UserRouteConstant } from "../routing/user-routing-constant.model";

export const  NavbarConstant = [
    {
        routeLink: ManagementRouteConstant.adminDashboard,
        label: "Dashboard",
        icon: 'dashboard',
        iconLibrary: "angular"
        
    },
    {
        routeLink: ManagementRouteConstant.foodManagement,
        label: "Food Management",
        icon: 'lunch_dining',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.inventoryManagement,
        label: "Inventory Management",
        icon: 'inventory_2',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.orderManagement,
        label: "Order Management",
        icon: 'dining',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.orderHistory,
        label: "Order History",
        icon: 'history',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.staffManagement,
        label: "Staff Management",
        icon: 'person',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.userManagement,
        label: "User Management",
        icon: 'people',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.userManagementPayment,
        label: "User Payment",
        icon: 'payments',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.tableManagement,
        label: "Table Management",
        icon: 'table_restaurant',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.report,
        label: "Report",
        icon: 'pie_chart',
        iconLibrary: "angular"
    },
    {
        routeLink: ManagementRouteConstant.announcement,
        label: "Announcement",
        icon: 'campaign',
        iconLibrary: "angular"
    },   
    // {
    //     routeLink: ManagementRouteConstant.test,
    //     label: "Announcement",
    //     icon: 'campaign',
    //     iconLibrary: "angular"
    // },   
];