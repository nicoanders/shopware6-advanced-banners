import template from './rl-advanced-banners-overview.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Shopware.Component.register('rl-advanced-banners-overview', {
    template,

    inject: ['repositoryFactory'],

    data() {
        return {
            isLoading: false,
            criteria: null,
            repository: null,
            items: null,
            term: this.$route.query ? this.$route.query.term : null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        columns() {
            return [
                {
                    property: 'technicalName',
                    dataIndex: 'technicalName',
                    label: 'rl-advanced-banners.list.technicalName',
                    routerLink: 'rl.advanced.banners.detail',
                }
            ];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.getList();
        },

        getList() {
            this.repository = this.repositoryFactory.create('rl_ab_banner');

            this.criteria = new Criteria();
            this.criteria.addSorting(Criteria.sort('createdAt', 'ASC'));

            if (this.term) {
                this.criteria.setTerm(this.term);
            }

            this.isLoading = true;

            const context = { ...Shopware.Context.api };

            return this.repository.search(this.criteria, context).then((result) => {
                this.total = result.total;
                this.items = result;
                this.isLoading = false;
            });
        },

        onSearch(term) {
            this.criteria.setTerm(term);
            this.$route.query.term = term;
            this.$refs.listing.doSearch();
        },

        onDelete(option) {
            this.$refs.listing.deleteItem(option);

            this.repository.search(this.criteria, { ...Shopware.Context.api, inheritance: true }).then((result) => {
                this.total = result.total;
                this.items = result;
            });
        },

        onRefresh() {
            this.getList();
        }
    }
});
