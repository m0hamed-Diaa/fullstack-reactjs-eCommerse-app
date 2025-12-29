import CookieService from '@/services/CookieService';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApiSlice = createApi({
    reducerPath: "adminApi",
    tagTypes: ["Products"],
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
        prepareHeaders: (headers) => {
            const AdminInfo = CookieService.get("AdminInfo");

            if (AdminInfo?.jwt) {
                headers.set('Authorization', `Bearer ${AdminInfo.jwt}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        getDashboardProducts: build.query({
            query: ({ page, pageSize, sortBy, debouncedSearch }) => `/api/products?pagination[pageSize]=${pageSize}&pagination[page]=${page}&populate=*&sort=createdAt:${sortBy}&filters[title][$containsi]=${debouncedSearch}`,
            providesTags: ["Products"],
        }),
        getCategory: build.query({
            query: () => `/api/categories?populate=*`,
            providesTags: ["Products"],
        }),
        updateProduct: build.mutation({
            query: ({ documentId, data }) => ({
                url: `/api/products/${documentId}`,
                method: 'PUT',
                body: { data },
            }),
            invalidatesTags: ["Products"]
        }),

        createProduct: build.mutation({
            query: (newProduct) => ({
                url: '/api/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Products'],
        }),

        deleteProduct: build.mutation({
            query: (documentId) => ({
                url: `/api/products/${documentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),

    }),
});

export const {
    useGetDashboardProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetCategoryQuery,
} = adminApiSlice;