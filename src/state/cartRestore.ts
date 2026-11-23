import { keepKnownItems } from '../core/keepKnownItems';
import { getProductById } from '../data/productLookup';
import { readCart } from './cartStorage';
import { replaceCart } from './cartStore';

/** Восстанавливает сохранённую корзину. */
export const restoreCart = (): void => replaceCart(keepKnownItems(readCart(), getProductById));
