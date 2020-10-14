// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

//备用mock数据,防止user数据丢失，造成的不好效果
const nameList = ['木香', '砂仁', '柏树', '陈皮', '微博官方助手', 'luna', 'jack']
const imgList = ['http://ww1.sinaimg.cn/large/006x4mSygy1gjojogc3elj3050050jrc.jpg',
    'http://ww1.sinaimg.cn/large/006x4mSygy1gjojryecydj3046046aa1.jpg',
    'http://ww1.sinaimg.cn/large/006x4mSygy1gjojsbw0fxj3046046jre.jpg',
    'http://ww1.sinaimg.cn/large/006x4mSygy1gjojtggdmij30j60j675a.jpg',
    'http://ww1.sinaimg.cn/large/006x4mSygy1gjok5j8uzxj30j60in0v1.jpg']


// 云函数入口函数
exports.main = async (event, context) => {
    console.log('hello')
    const subNewsList = [];
    let subNews = event.a;

    console.log(subNews)
    for (let i = 0; i < subNews.length; i++) {
        const subNew = subNews[i];
        console.log(subNew)
        for (let i = 0; i < subNew.detailNews.length; i++) {
            const detailNews_id = subNew.detailNews[i];
            const detailNews = await db.collection("fresh-detailNews").where({
                _id: detailNews_id
            }).get()
            console.log(detailNews)
            if (detailNews.data.length > 0) {
                subNew.detailNews[i] = detailNews.data[0]
            }
        }


        //在数据库钟通过id替换掉这个fromMan数据字段
        for (let i = 0; i < subNew.detailNews.length; i++) {

            const user_id = subNew.detailNews[i].fromMan;
            const user = await db.collection('fresh-users').where({
                _id: user_id
            }).get();
            if (user.data.length > 0) {
                subNew.detailNews[i].fromMan = user.data[0]
            } else {
                let nameindex = Math.floor(Math.random() * 7)
                let avatarindex = Math.floor(Math.random() * 5)
                const temp = {
                    avatar: imgList[avatarindex],
                    focusNews: {},
                    nickname: nameList[nameindex]
                }
                subNew.detailNews[i].fromMan = temp
            }


        }

        subNewsList.push(subNew)
    }
    return subNewsList;
}