export default class UserSeverityColorProvider {

    static getForRole(role) {
        switch (role) {
            case 'Developer':
                return 'info';
            case 'Admin':
                return 'warning';
            default:
                return 'success';
        }
    }
}
