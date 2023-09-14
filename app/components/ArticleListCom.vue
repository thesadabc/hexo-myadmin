<template>
  <el-container
    v-loading="isLoading"
    class="page"
    element-loading-text="loading..."
  >
    <el-main class="page-body">
      <el-table :data="tableData">
        <el-table-column
          fixed
          prop="title"
          label="Title"
          width="380"
        >
          <template #default="{row}">
            <router-link :to="row.to">
              <el-text type="primary">
                {{ row.title }}
              </el-text>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="articleType==='post'"
          prop="categories"
          label="Categories"
        />
        <el-table-column 
          v-if="articleType==='post'"
          prop="tags"
          label="Tags"
        />
        <el-table-column
          prop="date"
          label="CreateTime"
        />
        <el-table-column label="Status">
          <template #default="{row}">
            <el-text
              v-if="row.isDraft"
              type="warning"
            >
              draft
            </el-text>
            <el-text
              v-else
              type="success"
            >
              published
            </el-text>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="Operations"
          width="190"
        >
          <template #default="{row}">
            <el-button
              v-if="row.isDraft && api.publish"
              type="success"
              size="small"
              @click="handlePublish(row._id)"
            >
              publish
            </el-button>
            <el-button
              v-else-if="api.unpublish"
              type="warning"
              size="small"
              @click="handleUnpublish(row._id)"
            >
              unpublish
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleRemove(row._id)"
            >
              remove
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty
            v-if="!isLoading"
            :image-size="200"
          />
        </template>
      </el-table>
    </el-main>
    <el-footer class="page-footer">
      <el-pagination
        v-if="total>0"
        v-model:current-page="currentPage"
        small
        background
        layout="prev, pager, next"
        :page-size="15"
        :total="total"
      />
    </el-footer>
  </el-container>
</template>

<script setup>
import {ref, onMounted, computed, watch} from "vue";
import {ElMessage} from "element-plus";
import dateFormat from "dateformat";

import postApi from "../service/post";
import pageApi from "../service/page";

const props = defineProps(["articleType"]);
const api = props.articleType === "post" ? postApi : pageApi;

const articleList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const isLoading = ref(true);

const tableData = computed(() => 
    articleList.value.map((p)=> ({
        "_id": p._id,
        "title": p.title,
        "link": p.link,
        "tags": p.tags?.join(", ") || "-",
        "categories": p.categories?.join(", ") || "-",
        "updated": dateFormat(new Date(p.updated), "yyyy-mm-dd"),
        "date": dateFormat(new Date(p.date), "yyyy-mm-dd"),
        "isDraft": p.isDraft,
        "to": props.articleType === "post" ? 
            {"name":"PostDetail", "params":{"postId": p._id}}:
            {"name":"PageDetail", "params":{"pageId": p._id}},

    })),
);

async function handlePublish(articleId){
    const {code, data} = await api.publish(articleId);
    if (code) return;
    ElMessage.success("publish success");
    const p = articleList.value.find(p => p._id === articleId);
    p.isDraft = false;
    p._id = data._id;
    articleList.value = [...articleList.value];
}

async function handleUnpublish(articleId){
    const {code, data} = await api.unpublish(articleId);
    if (code) return;
    ElMessage.success("unpublish success");
    const p = articleList.value.find(p => p._id === articleId);
    p.isDraft = true;
    p._id = data._id;
    articleList.value = [...articleList.value];
}

async function handleRemove(articleId){
    const {code} = await api.remove(articleId);
    if (code) return;
    ElMessage.success("remove success");
    const pIdx = articleList.value.findIndex(p => p._id === articleId);
    articleList.value.splice(pIdx, 1);
}

async function loadList(){
    isLoading.value = true;
    const {data} = await api.list(currentPage.value);
    articleList.value = data.list;
    total.value = data.total;
    isLoading.value = false;
}
watch(currentPage, loadList);
onMounted(loadList);
</script>

<style scoped>
  .el-table {height: 100%;}
  .el-table .el-button {width: 80px;}
  .page-footer {text-align: right;}
  .el-pagination {justify-content: right;}
</style>

