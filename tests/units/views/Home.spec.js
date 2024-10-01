import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import Home from '@/views/Home.vue';

// JSDOM을 사용하여 브라우저 환경을 시뮬레이션
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="main-banner-carousel"></div></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js',
};

describe('Home.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Home);

        // 모듈 모킹
        vi.mock('axios');
    });

    it('should fetch carousel data on mount', async () => {
        const mockCarouselData = [
            { image_url: 'image1.jpg', alt: 'Image 1', background_color: '#fff' },
            { image_url: 'image2.jpg', alt: 'Image 2', background_color: '#000' }
        ];
        axios.get.mockResolvedValueOnce({ status: 200, data: mockCarouselData });

        await wrapper.vm.getCarouselData();

        expect(wrapper.vm.carousels).toEqual(mockCarouselData);
    });

    it('should fetch card data on mount', async () => {
        const mockCardData = [
            { image_url: 'card1.jpg', alt: 'Card 1', title: 'One Day Class', url: '/class' },
            { image_url: 'card2.jpg', alt: 'Card 2', title: 'Shop', url: '/shop' }
        ];
        axios.get.mockResolvedValueOnce({ status: 200, data: mockCardData });

        await wrapper.vm.getCardData();

        expect(wrapper.vm.cards).toEqual(mockCardData);
    });

    it('should set active index on carousel slide', async () => {
        const event = { to: 1 };
        wrapper.vm.setActiveIndex(event.to);

        expect(wrapper.vm.activeIndex).toBe(1);
        expect(wrapper.vm.activeImg).toBe(wrapper.vm.carousels[1]);
    });

    it('should return correct button text based on card title', () => {
        const card1 = { title: 'One Day Class' };
        const card2 = { title: 'Shop' };
        const card3 = { title: 'Support' };
        const card4 = { title: 'Other' };

        expect(wrapper.vm.getButtonText(card1)).toBe('Explore');
        expect(wrapper.vm.getButtonText(card2)).toBe('Buy Now');
        expect(wrapper.vm.getButtonText(card3)).toBe('Contact Us');
        expect(wrapper.vm.getButtonText(card4)).toBe('Learn More');
    });
});