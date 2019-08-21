const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");


const data = [
	{ 
		name: "木村的家露營區", 
		img: "http://mmmfile.emmm.tw/L3/952/image/daan03.jpg",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
	{ 
		name: "悠悠太魯閣露營區", 
		img: "http://www.17gogo.com.tw/wp-content/uploads/2014/04/P1010156.jpg",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
	{ 
		name: "浮源居森林露營車農莊", 
		img: "https://image.easycamp.com.tw/assets/img/album/1478/220/shrink/15820.jpg?v=1537153707",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
	{ 
		name: "日出營地", 
		img: "https://image.easycamp.com.tw/assets/img/store_aspic/2190.jpg?v=1536921695",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
	{ 
		name: "言葉之庭露營區", 
		img: "https://tse4.mm.bing.net/th?id=OIP.q3mR03_ddBLU-HG-VCoXngHaEK&pid=Api",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
	{ 
		name: "文化村喜樂營地", 
		img: "https://image.easycamp.com.tw/assets/img/store_aspic/2505.jpg?v=1561015931",
		description: "「拉拉山露營‧拉拉山木村的家露營區」位於拉拉山區，主要提供景觀露營區、另有販售產自拉拉山當地的水蜜桃，香甜多汁的水蜜桃，在拉拉山得天獨厚的自然環境之中，伴著新鮮的空氣及乾淨的泉水而生長，更添香甜風氣!"
	},
];


function seedDB() {
	Campground.remove({}, err => {
		if(err) {
			console.log(err);
		} else {
			console.log("all campgrounds removed");
			Comment.remove({}, err => {
				if(err) console.log(err);
				else console.log("all comments removed");
			});
			data.forEach(seed => {
				Campground.create(seed, (err, createdCamp) => {
					if(err) {
						console.log(err);
					} else {
						console.log("added a campground");
						Comment.create({
							text: "這裡很棒，風景很漂亮，可惜手機收訊不佳",
							author: "Wei"
						}, (err, createdComment) => {
							if(err) {
								console.log(err);
							} else {
								createdCamp.comments.push(createdComment);
								createdCamp.save();
								console.log("created new comment");
							}
						})
					}
				})
			})
		}
		
	})
}

module.exports = seedDB;