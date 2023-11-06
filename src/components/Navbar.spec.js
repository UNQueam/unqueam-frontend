import {render} from "/node_modules/@testing-library/vue/dist/index.js?v=bd64d17d";
import {describe, it, vi, expect} from "/node_modules/vitest/dist/index.js?v=bd64d17d";
import {createTestingPinia} from "/node_modules/@pinia/testing/dist/index.mjs?v=bd64d17d";
import PrimeVue from "/node_modules/primevue/config/config.cjs.js?v=bd64d17d";
import {createPinia, setActivePinia} from "/node_modules/pinia/dist/pinia.mjs?v=bd64d17d";
import Navbar from "/src/components/Navbar.vue";
import Toast from "/node_modules/primevue/toast/toast.cjs.js?v=bd64d17d";
import ConfirmationService from "/node_modules/primevue/confirmationservice/confirmationservice.cjs.js?v=bd64d17d";
import ToastService from "/node_modules/primevue/toastservice/toastservice.cjs.js?v=bd64d17d";
import {useToast} from "/node_modules/primevue/usetoast/usetoast.cjs.js?v=bd64d17d";
import ConfirmDialog from "/node_modules/primevue/confirmdialog/confirmdialog.cjs.js?v=bd64d17d";
import ConfirmPopup from "/node_modules/primevue/confirmpopup/confirmpopup.cjs.js?v=bd64d17d";

function mountNavbarWith(authenticationInfo) {
    return render(Navbar, {
        global: {
            components: [PrimeVue, Toast, useToast],
            plugins: [
                PrimeVue,
                ToastService,
                Toast,
                ConfirmationService,
                ConfirmDialog,
                ConfirmPopup,
                createTestingPinia({
                    initialState: {auth: {authenticationInfo: authenticationInfo}},
                    stubActions: false,
                    createSpy: vi.fn,
                    fakeApp: true,
                }),
            ],
        },
    });
}

const Role = {
    ADMIN: "Admin",
    USER: "User"
}

describe("Navbar.vue", () => {
    it("Should show Admin Menu if user has role Admin", async () => {
        const {findByTestId} = mountNavbarWith({username: "pepe", role: Role.ADMIN})

        setActivePinia(createPinia());

        const adminMenu = await findByTestId("admin_menu");
        expect(adminMenu).not.toBeNull();
    });

    it("Should not show Admin Menu if user has role User", async () => {
        const {queryByText} = mountNavbarWith({username: "pepe", role: Role.USER})

        setActivePinia(createPinia());

        const submitButton = await queryByText('Admin')
        expect(submitButton).toBeNull() // it doesn't exist
    });
});