import type { IProducts } from "@/interfaces";
import { toaster } from "@/components/ui/toaster";

interface IProps {
    title: string;
    max?: number;
    isOpen: boolean;
}

export const descriptionControl = ({ isOpen, title, max = 25 }: IProps) => {
    if (isOpen) {
        return title;
    } else {
        return `${title.slice(0, max)}...`
    }
}

export const addItemToShoppingCart = (cartItem: IProducts, shoppingCartItems: IProducts[]) => {
    return [...shoppingCartItems, { ...cartItem, quantity: 1 }];
}

export const increaseProductInShopping = (cartItem: IProducts, shoppingCartItems: IProducts[]) => {
    const existItem = shoppingCartItems.find(item => item.id === cartItem.id);
    if (existItem) {
        toaster.create({
            description: "Product quantity increased",
            type: "success",
        })
        return shoppingCartItems.map(item => item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item)
    }
    return shoppingCartItems;
}
export const decreaseProductInShopping = (cartItem: IProducts, shoppingCartItems: IProducts[]) => {
    const existItem = shoppingCartItems.find(item => item.id === cartItem.id);
    if (existItem) {
        if (existItem.quantity === 1) {
            return null;
        }
        return shoppingCartItems.map(item =>
            item.id === cartItem.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
    }
    return shoppingCartItems;
}

// for time of products
export const timeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `Ago ${diffInMinutes} minutes`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `Ago ${diffInHours} hour`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `Ago ${diffInDays} ${diffInDays === 1 ? 'Day' : 'Days'}`;
    }

    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    return date.toLocaleDateString('EG-ar', options);
};