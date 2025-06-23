// client/src/app/slices/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Use this instead of plain `useDispatch` for typed dispatch.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Use this instead of plain `useSelector` for typed state selection.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
