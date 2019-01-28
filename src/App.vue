<template>
  <div id="app">
      <m-header></m-header>
      <tab></tab>
      <keep-alive>
          <router-view></router-view>
      </keep-alive>
      <player></player>
  </div>
</template>

<script>
export default {
  name: 'App',
  components : {
      'm-header': () => import("@/components/m-header/m-header"),
      'tab': () => import("@/components/tab/tab"),
      'player': () => import("@/components/player/player"),
  }
}
</script>

<style>

</style>
