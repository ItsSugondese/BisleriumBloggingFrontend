import { ManagementRouteConstant } from "../routing/management-routing-constant.model"
import { UserRouteConstant } from "../routing/user-routing-constant.model";

export const  NavbarConstant = [
    {
        routeLink: ManagementRouteConstant.staffDashboard,
        label: "Dashboard",
        icon: 'dashboard',
        iconLibrary: "angular"
        
    },
    {
        routeLink: ManagementRouteConstant.staffManagement,
        label: "User Management",
        icon: 'person',
        iconLibrary: "angular"
    },
    
];