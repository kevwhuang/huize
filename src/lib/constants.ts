interface Route {
    children?: Route[];
    label: string;
    path: string;
}

export const BRAND = {
    en: 'Huize Health',
    zh: '惠泽健康',
} as const;

export const LINKS = {
    address: '上海市闵行区元江路525号24幢别墅',
    company: '上海惠泽智通健康科技有限公司',
    hotline: '400-6886-019',
    hotlineHref: 'tel:4006886019',
    hotlineLabel: '全国服务热线',
    icp: '沪ICP备2022021016号-2',
    icpHref: 'https://beian.miit.gov.cn/',
    police: '浙公网安备33011002014839号',
    policeHref: 'https://beian.mps.gov.cn/',
    shanghai: '021-5453-0907',
    shanghaiHref: 'tel:02154530907',
    shanghaiLabel: '上海总部',
    website: 'www.huizehealth.com',
    wechat: 'https://weixin.qq.com/r/wC6huRbEV0sorVLa93vS',
} as const;

export const PERCENT_SCALE = 100;
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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
