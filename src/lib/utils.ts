export const ROUTES: Route[] = [
    { label: '首页', path: '/' },
    {
        children: [
            { label: '康养服务', path: '/services/wellness' },
            { label: '健康管理', path: '/services/health' },
            { label: '保险服务', path: '/services/insurance' },
            { label: '高端定制', path: '/services/premium' },
        ],
        label: '服务中心',
        path: '/services',
    },
    {
        children: [
            { label: '公司新闻', path: '/news/company' },
            { label: '行业新闻', path: '/news/industry' },
        ],
        label: '新闻中心',
        path: '/news',
    },
    {
        children: [
            { label: '康养基地', path: '/network/bases' },
            { label: '养老机构', path: '/network/elderly-care' },
            { label: '医疗机构', path: '/network/medical' },
            { label: '服务城市', path: '/network/cities' },
        ],
        label: '服务网络',
        path: '/network',
    },
    {
        children: [
            { label: '公司简介', path: '/about' },
            { label: '企业文化', path: '/about/culture' },
            { label: '旗下机构', path: '/about/subsidiaries' },
            { label: '创始人', path: '/about/founder' },
            { label: '联系我们', path: '/about/contact' },
        ],
        label: '关于惠泽',
        path: '/about',
    },
];
