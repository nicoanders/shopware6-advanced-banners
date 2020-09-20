import template from './rl-advanced-banners-detail-sidebar.html.twig';
import './rl-advanced-banners-detail-sidebar.scss';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;
const utils = Shopware.Utils;

Component.register('rl-advanced-banners-detail-sidebar', {
    template,

    mixins: [
        Mixin.getByName('placeholder')
    ],

    props: {
        advancedBanner: {
            type: Object,
            required: true
        },
    },

    computed: {
        newMaxPosition() {
            if (this.advancedBanner.data.layers.length === 0) {
                return 0;
            }

            return Math.max(...this.advancedBanner.data.layers.map((layer) => layer.position || 0)) + 1;
        },
        defaultConfig() {
            return {
                technicalName: '',
                height: '100%',
                width: '100%',
                posTop: 0,
                posRight: 0,
                posBottom: 0,
                posLeft: 0,
                padTop: '0px',
                padRight: '0px',
                padBottom: '0px',
                padLeft: '0px',
                cssClass: ''
            };
        }
    },

    methods: {
        addTextLayer() {
            this.advancedBanner.data.layers.push({
                id: utils.createId(),
                type: 'text',
                position: this.newMaxPosition,
                config: Object.assign(this.defaultConfig, {
                    content: "Placeholder text",
                    textAlignX: 'left',
                    textAlignY: 'top'
                })
            });
        },
        addImageLayer() {
            this.advancedBanner.data.layers.push({
                id: utils.createId(),
                type: 'image',
                position: this.newMaxPosition,
                config: Object.assign(this.defaultConfig, {
                    mediaMode: 'cover',
                    mediaPositionX: 'center',
                    mediaPositionY: 'center',
                    mediaRepeat: 'no-repeat'
                })
            });
        },
        onLayerRemove(layer) {
            let data = this.advancedBanner.data.layers;

            for (let i = 0; i < data.length; i++) {
                if(data[i].id === layer.id) {
                    data.splice(i, 1);
                    break;
                }
            }

            this.updateLayerPositions();
        },

        onLayerDragSort(dragData, dropData, validDrop) {
            if (validDrop !== true) {
                return;
            }

            let oldIndex = dragData.position;
            let newIndex = dropData.position;

            if (oldIndex < 0 || oldIndex >= this.advancedBanner.data.layers.length) {
                return;
            }

            if (newIndex === oldIndex) {
                return;
            }

            const movedItem = this.advancedBanner.data.layers.find((item, index) => index === oldIndex);
            if (typeof movedItem === 'undefined') {
                return;
            }

            const remainingItems = this.advancedBanner.data.layers.filter((item, index) => index !== oldIndex);

            const orderedItems = [
                ...remainingItems.slice(0, newIndex),
                movedItem,
                ...remainingItems.slice(newIndex)
            ];

            this.advancedBanner.data.layers.splice(0, this.advancedBanner.data.layers.length, ...orderedItems);

            this.updateLayerPositions();
        },

        updateLayerPositions() {
            this.advancedBanner.data.layers.forEach((layer, index) => {
                layer.position = index;
            });
        }
    }
});
