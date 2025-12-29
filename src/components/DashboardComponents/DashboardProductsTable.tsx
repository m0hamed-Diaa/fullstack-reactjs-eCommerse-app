import {
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Stack,
  Table,
  TableCaption,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetDashboardProductsQuery,
  useUpdateProductMutation,
  useGetCategoryQuery,
} from "@/app/services/products";
import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Eye, PackagePlus, Pencil, Trash2 } from "lucide-react";
import DashboardProductsTableSkeleton from "./DashboardProductsTableSkeleton";
import { useEffect, useState, type ChangeEvent } from "react";
import type { ICategory, IEditProducts, IProducts } from "@/interfaces";
import { toaster } from "../ui/toaster";
import { timeAgo } from "@/utils";
import ChakraDialog from "../Dialog";
import CustomModal from "../shared/CustomModal";
import { useColorMode } from "../ui/color-mode";
import CookieService from "@/services/CookieService";
import { useSelector } from "react-redux";
import { networkSelector } from "@/app/features/networkSlice";

const DashboardProductsTable = () => {
  const { colorMode } = useColorMode();
  const { isOnline } = useSelector(networkSelector);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"ASC" | "DESC">("DESC");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);
  // Get Products
  const { data, isLoading } = useGetDashboardProductsQuery({
    page,
    pageSize,
    sortBy,
    debouncedSearch,
  });
  // Get Category
  const { data: categories } = useGetCategoryQuery({});
  // Delete Product
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const handleDelete = async (documentId: string) => {
    try {
      await deleteProduct(documentId);
      toaster.create({
        description: "Product deleted successfly",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      toaster.create({
        description: "An Error, Product not deleted",
        type: "error",
      });
    }
  };
  // Update Product methoud
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProductDocumentId, setCurrentProductDocumentId] =
    useState<string>("");

  const [thumbnail, setThumbnail] = useState<null | File>(null);
  const [editData, setEditData] = useState<IEditProducts>({
    title: "",
    price: 0,
    stock: 0,
    categories: [],
    description: "",
    thumbnail: undefined,
  });
  // ✅ فتح الـ Dialog
  const openEditDialog = (product: IProducts) => {
    setCurrentProductDocumentId(product.documentId);
    setEditData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
      categories: product.categories?.map((cat) => cat.documentId) || [],
    });
    setIsEditOpen(true);
    setThumbnail(null);
  };
  // Close Dialog
  const onCloseEdit = () => {
    setIsEditOpen(false);
    setEditData({
      title: "",
      price: 0,
      stock: 0,
      categories: [],
      description: "",
      thumbnail: undefined,
    });
    setCurrentProductDocumentId("");
  };
  // on change Edit dialog
  const onChangeEditHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    setEditData({ ...editData, [name]: value });
  };
  const onChangePriceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEditData({
      ...editData,
      price: isNaN(value) ? 0 : value,
    });
  };
  const onChangeStockHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setEditData({
      ...editData,
      stock: isNaN(value) ? 0 : value,
    });
  };
  const onChangeThumbnailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setThumbnail(files[0]);
    }
  };
  // Update Product
  const handleUpdate = async () => {
    if (!currentProductDocumentId) return;
    if (
      !editData.title ||
      !editData.price ||
      !editData.description ||
      !editData.stock ||
      !editData.categories?.length
    ) {
      toaster.create({
        description: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    try {
      let thumbnailId = editData.thumbnail?.id;

      if (thumbnail) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", thumbnail);

        const adminInfo = CookieService.get("AdminInfo");
        const uploadResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${adminInfo?.jwt}`,
            },
            body: uploadFormData,
          }
        );
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
        const uploadedFiles = await uploadResponse.json();
        thumbnailId = uploadedFiles[0].id;
      }
      await updateProduct({
        documentId: currentProductDocumentId,
        data: {
          title: editData.title,
          description: editData.description,
          price: editData.price,
          stock: editData.stock,
          categories: editData.categories,
          ...(thumbnailId && { thumbnail: thumbnailId }),
        },
      }).unwrap();

      toaster.create({
        description: "Product updated successfully!",
        type: "success",
      });
      onCloseEdit();
    } catch (error) {
      toaster.create({
        description: "Failed to update product",
        type: "error",
      });
      console.error("Update failed:", error);
    }
  };

  // Create new Product Update Product methoud
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [createData, setCreateData] = useState<IEditProducts>({
    title: "",
    price: 0,
    stock: 0,
    categories: [],
    description: "",
    thumbnail: undefined,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [thumbnailCreate, setCreateThumbnail] = useState<null | File>(null);

  const openCreateDialog = () => {
    setIsCreateOpen(true);
  };
  const onCloseCreate = () => {
    setIsCreateOpen(false);
    setCreateData({
      title: "",
      price: 0,
      stock: 0,
      categories: [],
      description: "",
      thumbnail: undefined,
    });
    setCreateThumbnail(null);
  };
  const onCreateHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    setCreateData({ ...createData, [name]: value });
  };
  const onCreatePriceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCreateData({
      ...createData,
      price: isNaN(value) ? 0 : value,
    });
  };
  const onCreateStockHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setCreateData({
      ...createData,
      stock: isNaN(value) ? 0 : value,
    });
  };
  const onCreateThumbnailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCreateThumbnail(files[0]);
    }
  };

  // Create Product
  const handleCreate = async () => {
    if (
      !createData.title ||
      !createData.price ||
      !createData.description ||
      !createData.stock ||
      !createData.categories?.length
    ) {
      toaster.create({
        description: "Please fill all required fields",
        type: "error",
      });
      return;
    }
    try {
      let thumbnailId;
      if (thumbnailCreate) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", thumbnailCreate);

        const adminInfo = CookieService.get("AdminInfo");
        const uploadResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${adminInfo?.jwt}`,
            },
            body: uploadFormData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadedFiles = await uploadResponse.json();
        thumbnailId = uploadedFiles[0].id;
      }

      await createProduct({
        data: {
          title: createData.title,
          description: createData.description,
          price: createData.price,
          stock: createData.stock,
          categories: createData.categories,
          ...(thumbnailId && { thumbnail: thumbnailId }),
        },
      }).unwrap();

      toaster.create({
        description: "Product created successfully!",
        type: "success",
      });
      onCloseCreate();
    } catch (error) {
      toaster.create({
        description: "Failed to Create product",
        type: "error",
      });
      console.error("Create failed:", error);
    }
  };
  // Handler للـ Sort By
  const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "ASC" | "DESC");
  };

  // Handler للـ Page Size
  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  };
  // Search for Product
  const searchForProduct = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  if (isLoading || !isOnline) {
    return <DashboardProductsTableSkeleton />;
  }
  return (
    <>
      <Box
        as={Flex}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDirection={{ base: "column", lg: "row" }}
        gap={{ base: "2", lg: "0" }}
      >
        <HStack gap={6} align="flex-start">
          {/* Sort By */}
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" fontWeight="medium">
              Sort By
            </Text>
            <NativeSelectRoot>
              <NativeSelectField
                value={sortBy}
                onChange={onChangeSortBy}
                borderWidth="1px"
                rounded="md"
                p={1}
                bg="transparent"
              >
                <option value="ASC">Oldest</option>
                <option value="DESC">Latest</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </VStack>

          {/* Page Size */}
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" fontWeight="medium">
              Items Per Page
            </Text>
            <NativeSelectRoot>
              <NativeSelectField
                value={pageSize}
                onChange={onChangePageSize}
                borderWidth="1px"
                rounded="md"
                p={1}
                bg="transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </VStack>
        </HStack>
        <Box mx={"auto"} w={{ base: "full", md: "380px" }} px={"3"}>
          <Input
            onChange={searchForProduct}
            type="search"
            mt={"5"}
            w={"full"}
            placeholder="Search for product"
            name="search"
            value={search}
            border={"1px solid gray"}
            outline={"none"}
            _focus={{
              border: "1px solid orange",
            }}
          />
          {data?.data?.length === 0 && search.length >= 1 && (
            <Text my={"2"}>
              NOT Found "<span style={{ color: "red" }}>{search}</span>" Product
            </Text>
          )}
        </Box>
        <HStack as={Flex} flexDirection={"column"} justifyContent={"start"}>
          <Text>Transfer between pages</Text>
          <Box as={Flex} alignItems={"center"} gap={2}>
            <Button
              bg={"orange.400"}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Text>Page {page}</Text>
            <Button
              bg={"orange.400"}
              onClick={() => setPage((p) => p + 1)}
              disabled={
                data?.data?.length === 0 ||
                page === data?.meta?.pagination.pageCount ||
                isLoading
              }
            >
              Next
            </Button>
          </Box>
        </HStack>
      </Box>
      {/* Add new Product modal */}
      <Box
        as={Flex}
        alignItems={"center"}
        gap={2}
        mt={5}
        justifyContent={{ base: "center", md: "start" }}
        title="Add new Product"
      >
        {/* ✅ Create Button */}
        <Button
          color={colorMode === "dark" ? "white" : "black"}
          bg={colorMode === "dark" ? "blue.800" : "blue.600"}
          onClick={() => openCreateDialog()}
        >
          Add new Product <PackagePlus />
        </Button>
        {/* Create Modal */}
        <CustomModal
          closeModal={onCloseCreate}
          title="Add new Product"
          isOpen={isCreateOpen}
        >
          <Field.Root mb={4}>
            <Field.Label>Title</Field.Label>
            <Input
              type="text"
              value={createData?.title || ""}
              name="title"
              onChange={onCreateHandler}
            />
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>Description</Field.Label>
            <Textarea
              value={createData?.description || ""}
              name="description"
              resize={"none"}
              rows={4}
              onChange={onCreateHandler}
            />
          </Field.Root>
          {/* Create Categories */}
          <Field.Root mb={4}>
            <Field.Label>Categories</Field.Label>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={3}
              maxH="200px"
              overflowY="auto"
              w={"full"}
            >
              <Stack gap={2}>
                {categories?.data?.map((cat: ICategory) => (
                  <HStack key={cat.documentId}>
                    <input
                      type="checkbox"
                      id={`cat-${cat.documentId}`}
                      checked={createData.categories?.includes(cat.documentId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCreateData({
                            ...createData,
                            categories: [
                              ...(createData.categories || []),
                              cat.documentId,
                            ],
                          });
                        } else {
                          setCreateData({
                            ...createData,
                            categories: createData.categories?.filter(
                              (id) => id !== cat.documentId
                            ),
                          });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      htmlFor={`cat-${cat.documentId}`}
                      style={{
                        cursor: "pointer",
                        userSelect: "none",
                        marginLeft: "8px",
                      }}
                    >
                      {cat.title}
                    </label>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>Price</Field.Label>
            <Input
              type="number"
              defaultValue={createData?.price || 0}
              name="price"
              onChange={onCreatePriceHandler}
            />
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>Stock</Field.Label>
            <Input
              type="number"
              defaultValue={createData?.stock || 0}
              name="stock"
              onChange={onCreateStockHandler}
            />
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>Thumbnail</Field.Label>
            <Input
              id="thumbnail"
              type="file"
              p={2}
              h={"full"}
              accept="image/png, image/gif, image/jpeg"
              onChange={onCreateThumbnailHandler}
            />
          </Field.Root>

          <Flex justifyContent={"end"} alignItems={"center"} gap={"2"}>
            <Button type="button" variant="outline" onClick={onCloseCreate}>
              Cancel
            </Button>

            <Button
              colorPalette="blue"
              loading={isCreating}
              onClick={handleCreate}
              loadingText="creating..."
            >
              Add new Product
            </Button>
          </Flex>
        </CustomModal>
      </Box>
      {data?.data?.length ? (
        <Table.ScrollArea maxW={"90"} mx={"auto"} my={6} overflowX={"auto"}>
          <Table.Root>
            <TableCaption textAlign={"center"} my={"2"}>
              Total Entries {data?.data?.length ? data?.data?.length : 0}
            </TableCaption>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Title</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Thumbnail</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Stock</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Options</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((product: IProducts, idx: number) => (
                <Table.Row key={product.id} position={"relative"}>
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{product.title}</Table.Cell>
                  <Table.Cell maxH={"100px"} overflowY={"auto"}>
                    {product.categories?.length > 0
                      ? product.categories.map((cat) => cat.title).join(", ")
                      : "No categories"}
                  </Table.Cell>
                  <Table.Cell>
                    <Image
                      src={`${product.thumbnail?.formats?.small?.url}`}
                      alt={`${product.title.split(" ").slice(0, 1).join(" ")}`}
                      rounded={"full"}
                      mt={"10px"}
                      boxSize={"60px"}
                      objectFit={"cover"}
                      border={"1px solid orange"}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "../../src/assets/No Image Vector Symb.png";
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="end">${product.price}</Table.Cell>
                  <Table.Cell textAlign="end">{product.stock}</Table.Cell>
                  <Table.Cell
                    display={"flex"}
                    justifyContent={"center"}
                    style={{ marginTop: "40px" }}
                    pb={10}
                    gap={"2"}
                  >
                    <Button
                      asChild
                      onClick={() => {}}
                      colorPalette={"purple"}
                      variant={"solid"}
                      title="See Product"
                    >
                      <Link to={`/products/${product.documentId}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Box outline={"none"} title="Delete Product">
                      <ChakraDialog
                        onClick={() => handleDelete(product.documentId)}
                        value={<Trash2 />}
                        isLoading={isDeleting}
                        title="Are you sure to delete this product"
                        description="If you delete this product, you aren't access to this product"
                      />
                    </Box>
                    {/* ✅ Edit Button */}
                    <Button
                      title="Edit Product"
                      color={colorMode === "dark" ? "white" : "black"}
                      bg={colorMode === "dark" ? "blue.400" : "blue.500"}
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil />
                    </Button>
                    {/* ✅ Edit Modal */}
                    <CustomModal
                      closeModal={onCloseEdit}
                      title="Product Edit"
                      isOpen={isEditOpen}
                    >
                      <Field.Root mb={4}>
                        <Field.Label>Title</Field.Label>
                        <Input
                          type="text"
                          value={editData?.title || ""}
                          name="title"
                          onChange={onChangeEditHandler}
                        />
                      </Field.Root>

                      <Field.Root mb={4}>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          value={editData?.description || ""}
                          name="description"
                          resize={"none"}
                          rows={4}
                          onChange={onChangeEditHandler}
                        />
                      </Field.Root>
                      {/* Update category */}
                      <Field.Root mb={4}>
                        <Field.Label>Categories</Field.Label>
                        <Box
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          p={3}
                          maxH="200px"
                          w={"full"}
                          overflowY="auto"
                        >
                          <Stack gap={2}>
                            {categories?.data?.map((cat: ICategory) => (
                              <HStack key={cat.documentId}>
                                <input
                                  type="checkbox"
                                  id={`cat-${cat.documentId}`}
                                  checked={editData.categories?.includes(
                                    cat.documentId
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditData({
                                        ...editData,
                                        categories: [
                                          ...(editData.categories || []),
                                          cat.documentId,
                                        ],
                                      });
                                    } else {
                                      setEditData({
                                        ...editData,
                                        categories: editData.categories?.filter(
                                          (id) => id !== cat.documentId
                                        ),
                                      });
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                />
                                <label
                                  htmlFor={`cat-${cat.documentId}`}
                                  style={{
                                    cursor: "pointer",
                                    userSelect: "none",
                                    marginLeft: "8px",
                                  }}
                                >
                                  {cat.title}
                                </label>
                              </HStack>
                            ))}
                          </Stack>
                        </Box>
                      </Field.Root>

                      <Field.Root mb={4}>
                        <Field.Label>Price</Field.Label>
                        <Input
                          type="number"
                          defaultValue={editData?.price || 0}
                          name="price"
                          onChange={onChangePriceHandler}
                        />
                      </Field.Root>

                      <Field.Root mb={4}>
                        <Field.Label>Stock</Field.Label>
                        <Input
                          type="number"
                          defaultValue={editData?.stock || 0}
                          name="stock"
                          onChange={onChangeStockHandler}
                        />
                      </Field.Root>

                      <Field.Root mb={4}>
                        <Field.Label>Thumbnail</Field.Label>
                        <Input
                          id="thumbnail"
                          type="file"
                          p={2}
                          h={"full"}
                          accept="image/png, image/gif, image/jpeg"
                          onChange={onChangeThumbnailHandler}
                        />
                      </Field.Root>

                      <Flex
                        justifyContent={"end"}
                        alignItems={"center"}
                        gap={"2"}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onCloseEdit}
                        >
                          Cancel
                        </Button>

                        <Button
                          colorPalette="blue"
                          loading={isUpdating}
                          onClick={handleUpdate}
                          loadingText="Updating..."
                        >
                          Update
                        </Button>
                      </Flex>
                    </CustomModal>
                  </Table.Cell>
                  <Table.Cell
                    fontSize={"sm"}
                    position={"absolute"}
                    bottom={"5px"}
                    left={"5px"}
                    bg={"orange.400"}
                    rounded={"lg"}
                    p={"1"}
                  >
                    {timeAgo(product.createdAt)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      ) : (
        <Box
          w={"100%"}
          h={"70vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          NO Products yet!
        </Box>
      )}
    </>
  );
};

export default DashboardProductsTable;
