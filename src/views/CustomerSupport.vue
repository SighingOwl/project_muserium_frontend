<template>
    <div class="container mypage-container">
        <div class="row">
            <div class="col-3">
                <nav class="nav flex-column">
                    <a class="nav-link" href="#" :class="{ active: activeTab === 'Notice' }" @click="showComponent('Notice')">공지사항</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'Shipping' }" @click="showComponent('Shipping')">배송안내</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'FAQ' }" @click="showComponent('FAQ')">FAQ</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'Contact' }" @click="showComponent('Contact')">1:1문의</a>
                </nav>
            </div>
            <div class="col-9">
                <component :is="currentTabComponent" :activeTab="activeTab" @change-tab="showComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
import Notice from '@/components/supportPage/Notice.vue';
import Shipping from '@/components/supportPage/Shipping.vue';
import FAQ from '@/components/supportPage/FAQ.vue';
import Contact from '@/components/supportPage/Contact.vue';

export default {
    data() {
        return {
            activeTab: 'Notice',
        };
    },
    computed: {
        currentTabComponent() {
            switch(this.activeTab) {
                case 'Notice':
                    return Notice;
                case 'Shipping':
                    return Shipping;
                case 'FAQ':
                    return FAQ;
                case 'Contact':
                    return Contact;
                default:
                    return Notice;
            }
        }
    },
    components: {
        Notice,
        Shipping,
        FAQ,
        Contact,
    },
    created() {
        const tab = this.$route.params.tab;
        if (tab) {
            this.activeTab = tab;
        }
    },
    methods: {
        showComponent(componentName) {
            this.activeTab = componentName;
        }
    }
};
</script>

<style scoped>
.mypage-container {
    margin-top: 10em;
    margin-bottom: 10em;
}

.nav-link {
    font-size: 1.2rem;
    color: #808080;
    cursor: pointer;
}

.nav-link:hover {
    color: #000000;
}

.active {
    color: #000000;
    text-decoration: underline;
}
</style>