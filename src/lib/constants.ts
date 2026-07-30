export const BASES = [
    { name: '大理十畝花园', region: '云南' },
    { name: '杭州御湘湖', region: '浙江' },
    { name: '郴州十畝泉基地', region: '湖南' },
    { name: '三亚海棠湾恒大养生谷', region: '海南' },
    { name: '仁帝山雨林康养基地', region: '海南' },
    { name: '保亭神玉岛', region: '海南' },
    { name: '白沙鹭湖养生度假基地', region: '海南' },
    { name: '澄迈红树湾湿地公园', region: '海南' },
    { name: '五指山水云间康养基地', region: '海南' },
    { name: '北京荣华齐山康养基地', region: '北京' },
    { name: '海南荣华康馨园', region: '海南' },
    { name: '黄山自在谷世遗基地', region: '安徽' },
    { name: '博鳌宝莲城康养基地', region: '海南' },
    { name: '陵水珊瑚宫殿', region: '海南' },
    { name: '西双版纳勐巴拉基地', region: '云南' },
    { name: '七仙瑶池温泉基地', region: '海南' },
    { name: '保亭荔苑温泉基地', region: '海南' },
    { name: '江西婺源篁岭', region: '江西' },
    { name: '儋州海花岛', region: '海南' },
    { name: '乐东龙沐湾康养基地', region: '海南' },
    { name: '上海崇明东滩信澜天地', region: '上海' },
] as const;

export const BASE_THEMES = ['温泉', '雨林', '海滩', '湿地'] as const;

export const CITY_COVERAGE = [
    {
        name: '华北地区',
        provinces: [
            { cities: ['北京'], name: '北京市' },
            { cities: ['天津'], name: '天津市' },
            { cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水', '辛集', '藁城', '晋州', '新乐', '鹿泉', '遵化', '丰南', '迁安', '武安', '南宫', '沙河', '涿州', '定州', '安国', '高碑店', '泊头', '任丘', '黄骅', '河间', '霸州', '三河', '冀州', '深州'], name: '河北省' },
            { cities: ['太原', '大同', '晋城', '朔州', '忻州', '阳泉', '长治', '吕梁', '晋中', '临汾', '运城', '榆次', '霍州'], name: '山西省' },
            { cities: ['呼和浩特', '包头', '呼伦贝尔', '通辽', '乌海', '赤峰', '乌兰察布', '鄂尔多斯', '巴彦淖尔', '锡林郭勒', '兴安', '满洲里', '锡林浩特', '二连浩特'], name: '内蒙古' },
        ],
    },
    {
        name: '华东地区',
        provinces: [
            { cities: ['上海'], name: '上海市' },
            { cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮阴', '盐城', '扬州', '镇江', '泰州', '宿迁', '江阴', '宜兴', '锡山', '新沂', '邳州', '溧阳', '金坛', '武进', '常熟', '张家港', '昆山', '吴江', '太仓', '吴县', '启东', '如皋', '通州', '海门', '淮安', '东台', '大丰', '仪征', '高邮', '江都', '丹阳', '扬中', '句容', '兴化', '靖江', '泰兴', '姜堰'], name: '江苏省' },
            { cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '萧山', '建德', '富阳', '余杭', '临安', '余姚', '慈溪', '奉化', '瑞安', '乐清', '海宁', '平湖', '桐乡', '诸暨', '上虞', '嵊州', '兰溪', '义乌', '东阳', '永康', '江山', '温岭', '临海', '丽水', '龙泉'], name: '浙江省' },
            { cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '桐城', '天长', '明光', '亳州', '界首', '宣州', '宁国', '贵池'], name: '安徽省' },
            { cities: ['福州', '厦门', '漳州', '泉州', '莆田', '龙岩', '三明', '南平', '宁德'], name: '福建省' },
            { cities: ['南昌', '鹰潭', '赣州', '九江', '景德镇', '宜春', '吉安', '上饶', '抚州', '萍乡', '新余'], name: '江西省' },
            { cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '章丘', '胶州', '即墨', '平度', '胶南', '莱西', '滕州', '龙口', '莱阳', '莱州', '蓬莱', '招远', '栖霞', '海阳', '青州', '诸城', '寿光', '安丘', '高密', '昌邑', '曲阜', '兖州', '邹城', '新泰', '肥城', '文登', '荣成', '乳山', '乐陵', '禹城', '临清', '滨州', '菏泽'], name: '山东省' },
        ],
    },
    {
        name: '华中地区',
        provinces: [
            { cities: ['郑州', '洛阳', '开封', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '周口', '驻马店', '南阳', '信阳', '三门峡', '商丘'], name: '河南省' },
            { cities: ['武汉', '黄石', '十堰', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '大冶', '丹江口', '枝城', '当阳', '枝江', '老河口', '枣阳', '宜城', '钟祥', '应城', '安陆', '广水', '汉川', '石首', '洪湖', '松滋', '麻城', '武穴', '赤壁', '恩施', '利川', '随州', '仙桃', '潜江', '天门'], name: '湖北省' },
            { cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '浏阳', '醴陵', '湘乡', '韶山', '耒阳', '常宁', '武冈', '汩罗', '临湘', '津市', '沅江', '资兴', '洪江', '冷水江', '涟源', '吉首'], name: '湖南省' },
        ],
    },
    {
        name: '华南地区',
        provinces: [
            { cities: ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮', '番禺', '花都', '增城', '从化', '乐昌', '南雄', '潮阳', '澄海', '顺德', '南海', '三水', '高明', '台山', '新会', '开平', '鹤山', '恩平', '廉江', '雷州', '吴川', '高州', '化州', '信宜', '高要', '四会', '惠阳', '兴宁', '陆丰', '阳春', '英德', '连州', '普宁', '罗定'], name: '广东省' },
            { cities: ['南宁', '柳州', '桂林', '梧州', '北海', '崇左', '来宾', '贺州', '玉林', '百色', '河池', '钦州', '防城港', '贵港'], name: '广西省' },
            { cities: ['海口', '三亚', '三沙', '儋州', '昌江', '琼海', '万宁'], name: '海南省' },
        ],
    },
    {
        name: '西南地区',
        provinces: [
            { cities: ['重庆'], name: '重庆市' },
            { cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '宜宾', '广安', '达州', '都江堰', '彭州', '邛崃', '崇州', '广汉', '什邡', '绵竹', '江油', '峨眉山', '阆中', '华蓥', '万源', '雅安', '西昌', '巴中', '资阳', '简阳'], name: '四川省' },
            { cities: ['贵阳', '六盘水', '遵义', '铜仁', '毕节', '安顺', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '黔西南布依族苗族自治州'], name: '贵州省' },
            { cities: ['昆明', '昭通', '曲靖', '玉溪', '普洱', '保山', '丽江', '临沧', '楚雄', '大理', '德宏', '红河', '文山', '西双版纳'], name: '云南省' },
            { cities: ['拉萨', '昌都', '山南', '日喀则', '那曲', '林芝', '阿里'], name: '西藏' },
        ],
    },
    {
        name: '西北地区',
        provinces: [
            { cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '汉中', '安康', '商洛', '延安', '榆林'], name: '陕西' },
            { cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '酒泉', '张掖', '武威', '定西', '陇南', '平凉', '庆阳'], name: '甘肃' },
            { cities: ['西宁', '海东', '海西', '海北', '海南'], name: '青海' },
            { cities: ['银川', '石嘴山', '吴忠', '固原', '中卫'], name: '宁夏' },
            { cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '阿克苏', '阿勒泰', '博尔塔拉', '昌吉', '库尔勒', '石河子', '伊犁'], name: '新疆' },
        ],
    },
    {
        name: '东北地区',
        provinces: [
            { cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'], name: '辽宁省' },
            { cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '白城', '松原', '延边'], name: '吉林省' },
            { cities: ['哈尔滨', '齐齐哈尔', '伊春', '牡丹江', '佳木斯', '大庆', '鸡西', '鹤岗', '双鸭山', '七台河', '绥化', '黑河'], name: '黑龙江省' },
        ],
    },
] as const;

export const INSTITUTION_PROVINCES = [
    { cities: 21, institutions: 200, name: '广东', sample: ['广州', '深圳', '珠海', '汕头', '韶关', '佛山'] },
    { cities: 14, institutions: 158, name: '江苏', sample: ['南京', '苏州', '无锡', '常州', '徐州', '南通'] },
    { cities: 18, institutions: 155, name: '北京', sample: ['朝阳', '丰台', '大兴', '石景山', '海淀', '昌平'] },
    { cities: 17, institutions: 106, name: '河南', sample: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁'] },
    { cities: 19, institutions: 102, name: '四川', sample: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳'] },
    { cities: 11, institutions: 101, name: '浙江', sample: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴'] },
    { cities: 14, institutions: 95, name: '山东', sample: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台'] },
    { cities: 14, institutions: 94, name: '辽宁', sample: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东'] },
    { cities: 16, institutions: 89, name: '安徽', sample: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北'] },
    { cities: 13, institutions: 75, name: '湖北', sample: ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄阳'] },
    { cities: 12, institutions: 74, name: '广西', sample: ['南宁', '柳州', '桂林', '梧州', '北海', '贵港'] },
    { cities: 11, institutions: 72, name: '河北', sample: ['石家庄', '唐山', '秦皇岛', '张家口', '承德'] },
    { cities: 15, institutions: 71, name: '上海', sample: ['浦东', '嘉定', '黄浦', '杨浦', '金山', '闵行'] },
    { cities: 15, institutions: 71, name: '湖南', sample: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳'] },
    { cities: 11, institutions: 59, name: '江西', sample: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭'] },
    { cities: 14, institutions: 56, name: '黑龙江', sample: ['哈尔滨', '齐齐哈尔', '鹤岗', '双鸭山', '鸡西', '大庆'] },
    { cities: 11, institutions: 52, name: '内蒙古', sample: ['呼和浩特', '包头', '呼伦贝尔', '通辽', '赤峰', '乌兰察布'] },
    { cities: 7, institutions: 52, name: '吉林', sample: ['长春', '四平', '辽源', '通化', '白山'] },
    { cities: 10, institutions: 47, name: '陕西', sample: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安'] },
    { cities: 6, institutions: 46, name: '云南', sample: ['昆明', '曲靖', '玉溪', '保山', '昭通', '临沧'] },
    { cities: 10, institutions: 42, name: '福建', sample: ['福州', '厦门', '莆田', '三明', '泉州', '漳州'] },
    { cities: 8, institutions: 41, name: '山西', sample: ['太原', '大同', '朔州', '忻州', '阳泉', '吕梁'] },
    { cities: 1, institutions: 40, name: '重庆', sample: [] },
    { cities: 6, institutions: 38, name: '贵州', sample: ['贵阳', '六盘水', '遵义', '安顺', '铜仁地', '毕节地'] },
    { cities: 8, institutions: 21, name: '甘肃', sample: ['兰州', '白银', '天水', '嘉峪关', '张掖', '酒泉'] },
    { cities: 2, institutions: 19, name: '新疆', sample: ['乌鲁木齐', '喀什地'] },
    { cities: 3, institutions: 14, name: '宁夏', sample: ['银川', '吴忠', '中卫'] },
    { cities: 2, institutions: 10, name: '海南', sample: ['海口', '三亚'] },
    { cities: 2, institutions: 9, name: '青海', sample: ['西宁', '海东地'] },
] as const;

export const LINKS = {
    address: '上海市闵行区元江路525号24幢别墅',
    addressShort: '上海市闵行区元江路525号',
    company: '上海惠泽智通健康科技有限公司',
    hotline: '400-6886-019',
    hotlineHref: 'tel:4006886019',
    icp: '沪ICP备2022021016号-2',
    icpHref: 'https://beian.miit.gov.cn/',
    police: '浙公网安备33011002014839号',
    policeHref: 'https://beian.mps.gov.cn/',
    shanghai: '021-5453-0907',
    shanghaiHref: 'tel:02154530907',
    website: 'www.huizehealth.com',
    wechat: 'http://weixin.qq.com/r/wC6huRbEV0sorVLa93vS',
} as const;

export const NEWS_COMPANY = [
    {
        date: '2024-03-29',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        summary: '2024年3月29日，双方在惠泽健康上海总部举行全面战略合作协议签署仪式，围绕大健康生态圈、保险产品创新与健康医疗大数据平台展开深度合作。',
        title: '招商仁和人寿携手上海惠泽健康开启全面战略合作',
    },
    {
        date: '2023-09-01',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        summary: '上海惠泽智通健康科技有限公司发布重要公告。',
        title: '重要公告，必读！',
    },
    {
        date: '2022-11-26',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
        summary: '发布会汇聚博鳌乐城管理局与多家保司代表，以新模式将稀缺的医疗资源与先进药械更便捷地传递给大众。',
        title: '惠泽健康【药安心*全球药械专享服务】隆重上市',
    },
    {
        date: '2022-05-09',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        summary: '动脉网专题报道惠泽健康如何以康复护理为特色，构建触达全国的健康管理服务网络。',
        title: '以康复护理为特色，惠泽健康如何构建触达全国的健康管理服务网络？',
    },
    {
        date: '2022-01-27',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        summary: '由清华大学金融科技研究院等学术指导单位发起，经深圳、青岛、成都、苏州、上海五大赛区评审后入选。',
        title: '惠泽健康成功入选2021年全球金融科技创业大赛优胜项目50强',
    },
    {
        date: '2021-06-13',
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
        summary: '第九届中国老年福祉产品创意创新创业大赛在上海落幕，惠泽健康从900余件参赛作品中脱颖而出。',
        title: '惠泽健康荣获第九届中国老年福祉产品创意创新创业大赛金奖',
    },
] as const;

export const NEWS_INDUSTRY = [
    {
        date: '2020-09-26',
        summary: '介绍缓解小儿排便困难、腹泻以及助睡眠的推拿手法。',
        title: '教你这些小儿推拿手法，让孩子常年不生病，好处多多！',
    },
    {
        date: '2020-09-07',
        summary: '康复是实现联合国2030年可持续发展目标中全民健康覆盖目标的关键，世界卫生组织发布行动指南。',
        title: '健康服务体系中的康复 — 行动指南',
    },
    {
        date: '2020-06-30',
        summary: '我国康复医疗历经起步期与推广期，现已进入规范期，构筑覆盖综合医院康复科、康复专科医院与居家康复的体系。',
        title: '2019年康复产业发展研究报告',
    },
    {
        date: '2020-06-27',
        summary: '2014至2018年中国大健康产业营收持续增长，2018年规模超5万亿元，预计2020年将超9万亿元。',
        title: '艾媒报告：2019年全球及中国大健康产业运行大数据及决策分析报告',
    },
    {
        date: '2020-06-27',
        summary: '我国居民健康意识增强，医疗保健支出增速持续走高。',
        title: '2019中国家庭医疗健康消费趋势报告',
    },
    {
        date: '2020-06-27',
        summary: '2015年十八届五中全会将建设“健康中国”上升为国家战略。',
        title: '2019国民健康洞察报告',
    },
] as const;

export const OWNED_INSTITUTIONS = [
    { address: '重庆市沙坪坝区歌乐山镇龙洞湾101号', brand: '合展', name: '重庆合展天池老年护养中心' },
    { address: '重庆市大渡口区金桥路1号', brand: '合展', name: '重庆合展守护者老年护养中心' },
    { address: '重庆市江北区铁山坪逸兴路19号', brand: '合展', name: '重庆合展五季元老年护养中心' },
    { address: '重庆市沙坪坝壮志路2号', brand: '合展', name: '重庆合展至诚老年护养中心' },
    { address: '重庆市璧山区景山路99号', brand: '合展', name: '重庆合展至亲老年护养中心' },
    { address: '重庆市渝中区长江二路181号', brand: '合展', name: '重庆合展至善老年护养中心' },
    { address: '重庆市沙坪坝区歌乐山镇龙洞湾101号', brand: '合展', name: '重庆合展至上护理院' },
    { address: '重庆市两江新区康美街道翠竹路5号', brand: '合展', name: '重庆合展至臻护养中心' },
    { address: '杭州市江干区丁兰街道沿山村鲍家渡3号', brand: '绿康', name: '杭州绿康医院' },
    { address: '浙江省杭州市余杭区仁和街道云会村西南山东路23号', brand: '绿康', name: '杭州绿康护理院' },
    { address: '浙江省绍兴市越城区胜利西路1239号绍兴市社会福利院中心院区', brand: '绿康', name: '绍兴绿康老年康复护理院' },
    { address: '余姚市长安路777号', brand: '绿康', name: '宁波余姚舜辰绿康护理院' },
    { address: '浙江省杭州市江干区机场路三里亭工农路99号', brand: '绿康', name: '杭州绿康医院·杭州市第二社会福利院院区' },
    { address: '浙江省湖州市吴兴区北齐巷22号（所前西街）', brand: '绿康', name: '湖州绿康老年康复护理院' },
    { address: '椒江区葭沚街道洪西路800号（淑江区社会福利院内）', brand: '绿康', name: '椒江绿康老年康复护理院' },
    { address: '嘉兴市平湖市当湖街道县后底120号', brand: '绿康', name: '嘉兴平湖绿康老年康复护理院' },
    { address: '浙江省温州市永嘉县东城街道河底村118号', brand: '绿康', name: '永嘉绿康康复医院' },
    { address: '宁波市鄞州区首南街道文水路388号', brand: '绿康', name: '宁波鄞州绿康博美康复医院' },
    { address: '建湖县兴建东路999号（第三人民医院东临）', brand: '绿康', name: '建湖绿康康复医院' },
    { address: '椒江区下陈街道渠村99号', brand: '绿康', name: '椒江绿康老年康复护理院·桑榆情院区' },
    { address: '椒江区海门街道青年路233号（区公安分局对面）', brand: '绿康', name: '椒江绿康老年康复护理院·枫叶情院区' },
    { address: '浙江省金华市永康市江南街道傅店村仙溪东路999号', brand: '绿康', name: '永康绿康康复医院' },
    { address: '浙江省杭州市萧山区闻堰镇湘滨路1999号', brand: '绿康', name: '杭州滨江绿康康复医院' },
    { address: '浙江省杭州市西湖区留下街道小和山支路88号内', brand: '绿康', name: '杭州西湖绿康医院' },
    { address: '广东省惠州市惠东县平山街道寨场山路3号', brand: '绿康', name: '惠东绿康西枝家园' },
    { address: '椒江区葭沚街道洪西路800号（淑江区社会福利院内）', brand: '绿康', name: '台州绿康灵江家园' },
    { address: '建湖县兴建东路999号（第三人民医院东临）', brand: '绿康', name: '盐城绿康湖垛家园' },
    { address: '江西省南昌市青山湖区顺外路2187号（万科城北门对面）', brand: '绿康', name: '南昌绿康豫章家园' },
    { address: '浙江省金华市永康市江南街道傅店村仙溪东路999号', brand: '绿康', name: '永康绿康丽州家园' },
    { address: '兴安街道岑阳大道西侧', brand: '绿康', name: '上饶绿康岑阳家园' },
    { address: '浙江省杭州市江干区丁兰街道沿山鲍家渡3号', brand: '绿康', name: '杭州绿康丁兰家园' },
    { address: '浙江省温州市永嘉县东城街道河底村118号', brand: '绿康', name: '温州绿康楠溪家园' },
    { address: '浙江省绍兴市越城区胜利西路1239号（绍兴市社会福利中心正门右侧/绍兴市第七人民医院对面）', brand: '绿康', name: '绍兴绿康越州家园' },
    { address: '台州市玉环市楚门镇环城北路68号（原玉环市第二人民医院住院楼）', brand: '绿康', name: '玉环绿康榴岛家园' },
    { address: '杭州市江干区丁兰街道绿园弄51号', brand: '绿康', name: '上城绿康邻汇家园' },
    { address: '浙江省杭州市余杭区仁和街道云会村西南山东路23号', brand: '绿康', name: '杭州绿康云会家园' },
    { address: '浙江省杭州市上城区丁兰街道沿山鲍家渡3号', brand: '绿康', name: '杭州市江干区（现上城区）残疾人康复托养中心' },
    { address: '浙江省杭州市余杭区仁和街道云会村西南山东路23号', brand: '绿康', name: '杭州市余杭区绿康养老助残服务中心' },
    { address: '平湖市当湖街道县后底120号', brand: '绿康', name: '平湖绿康养老服务中心' },
    { address: '浙江省杭州市上城区丁兰街道沿山鲍家渡3号', brand: '绿康', name: '杭州市上城区绿康介护职业培训学校' },
    { address: '浙江省杭州市上城区丁兰街道环丁路1433号四层', brand: '绿康', name: '杭州市上城区绿康养老服务评估中心' },
    { address: '浙江省杭州市余杭区仓前工业区龙潭路6号', brand: '绿康', name: '浙江绿慷尔介护职业学校' },
    { address: '浙江省杭州市上城区丁兰街道沿山鲍家渡3号', brand: '绿康', name: '杭州市上城区绿康老年科学技术研究所' },
] as const;

export const PUBLIC_HOSPITALS = 11_000;

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

export const SERVICES = [
    {
        english: 'Wellness',
        headline: '全国性养老服务提供商',
        id: 'wellness',
        image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
        label: '康养服务',
        number: '01',
        path: '/services/wellness',
        subtitle: '旅居康养 · 全国养老',
        summary: '旅居康养疗愈，全国养老服务。依托遍布全国的康养基地与养老机构网络，提供多场景的专业照护。',
    },
    {
        english: 'Health',
        headline: '一站式健康管理服务',
        id: 'health',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
        label: '健康管理',
        number: '02',
        path: '/services/health',
        subtitle: '诊疗 · 护理 · 康复',
        summary: '绿通、诊疗、护理、康复、购药一体化。聚焦脑卒中、骨科等刚需领域，提供住院—社区—居家三级康复服务。',
    },
    {
        english: 'Insurance',
        headline: '商保公司健康增值服务',
        id: 'insurance',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        label: '保险服务',
        number: '03',
        path: '/services/insurance',
        subtitle: '一站式健康增值',
        summary: '一站式健康增值服务。为保险与企业客户提供健康管理、理赔协助与定制化增值方案。',
    },
    {
        english: 'Premium',
        headline: '高端定制健管服务',
        id: 'premium',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        label: '高端定制',
        number: '04',
        path: '/services/premium',
        subtitle: '免疫 · 细胞 · 海外医疗',
        summary: '免疫、细胞、特药、海外医疗。为高净值家庭提供前沿医疗与全球优质医疗资源对接。',
    },
] as const;

export const STATS = [
    { countTo: '40', label: '实体机构', suffix: '+' },
    { countTo: '100', label: '合作机构', suffix: '+' },
    { countTo: '1000', label: '服务人次', suffix: '万+' },
    { countTo: '500', label: '服务城市', suffix: '+' },
] as const;

export const TOTAL_CITIES = 530;

export const TOTAL_INSTITUTIONS = 2009;
