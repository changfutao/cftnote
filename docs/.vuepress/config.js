const navConfig = require("./config/navConfig");

module.exports = {
    title: '学习笔记',
    description: 'ross的文档',
    themeConfig: {
        lastUpdated: '上次更新',
        nav: navConfig
    },
    plugins: {
        "vuepress-plugin-auto-sidebar": {}
    },
    markdown: {
        lineNumbers: true
    }
}