export default class UserSeverityColorProvider {

    static getForRole(role) {
        switch (role) {
            case 'DEVELOPER':
                return 'info';
            case 'ADMIN':
                return 'warning';
            default:
                return 'success';
        }
    }
}
