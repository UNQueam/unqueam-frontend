export default class DeveloperRequestColorProvider {

    static getForStatus(status) {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'REJECTED':
                return 'error';
            default:
                return 'success';
        }
    }
}
