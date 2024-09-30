import { mount } from '@vue/test-utils';
import Home from '@/components/Home.vue';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios');

describe('Home.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Home);
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