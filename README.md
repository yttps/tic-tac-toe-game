# tic-tac-toe-game
เกม XO เล่นกับบอท พร้อมระบบบันทึกและดูประวัติย้อนหลัง

# 📄 Description

เกม Tic Tac Toe (XO) พัฒนาโดยใช้ React และ Express พร้อมระบบบันทึกประวัติเกมลงใน MongoDB สามารถเล่นกับบอทและดูรีเพลย์ย้อนหลังได้

# ⚙️ วิธีติดตั้งและรันโปรเจกต์ (Setup Project)

- Front-End (React)

	1.เปิด Terminal หรือ CMD
	
	2.สร้างโปรเจกต์ด้วย Vite:

  		npm create vite@latest
	
	3.ตั้งชื่อโปรเจกต์ว่า tic-tac-toe-game และเลือก Framework: React , Variant: JavaScript

	4.เข้าสู่โฟลเดอร์โปรเจกต์และติดตั้ง dependency ใช้คำสั่ง

  		cd tic-tac-toe-game
  		npm install

	5.ติดตั้ง Tailwind CSS ใช้คำสั่ง

  		npm install -D tailwindcss postcss
  		autoprefixer npx tailwindcss init -p

	6.แก้ไข tailwind.config.js:

  		content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]

	7.เพิ่ม Tailwind directive ใน src/index.css:
  
		@tailwind base;
		@tailwind components;
		@tailwind utilities;

	8.เริ่มเซิร์ฟเวอร์:

		npm run dev

	9.ภายใน Folder src ทำการสร้าง Folder เพิ่ม คือ assets(สำหรับเก็บรูปภาพ) , Replay(สำหรับเก็บ Component รีเพลย์ประวัติการเล่น) ,
  TicTacToePage(สำหรับเก็บ Component การเล่น) , WelcomePage(สำหรับเก็บ Component หน้าแรก)





- Back-End (Node.js) and Database MongoDB

  1.สร้าง Folder และ เปิด Terminal หรือ CMD

	2.สร้างโปรเจกต์และติดตั้ง dependencies

		npm init -y
		npm install express mongoose dotenv cors
		npm install nodemon --save-dev

	3.สร้างไฟล์ .env และกำหนด PORT , MONGODB_URI

	4.เริ่มรัน Server ใช้คำสั่ง

	  npm start
	  หรือ
	  node index.js

	5.📁 โฟลเดอร์ Backend ประกอบด้วย:

		index.js – จุดเริ่มต้นของเซิร์ฟเวอร์ Express
	
		models/Game.js – โมเดลข้อมูลของเกม
		
		.env – เก็บค่าคอนฟิกเช่นพอร์ตและ URL ของ MongoDB
		
		package.json – รายละเอียด dependency ต่าง ๆ

	6.📁 โครงสร้าง Model (Game.js)

		const gameSchema = new mongoose.Schema({
		  date: String,             // วันที่เล่น
		  boardSize: Number,        // ขนาดกระดาน เช่น 3
		  winner: String,           // 'Player', 'Bot', หรือ 'Draw'
		  moves: [                  // ลำดับการเล่น
	    { index: Number, player: String }
		  ],
		  winningCells: [Number],   // ช่องที่ชนะ
			});

	7.📡 REST API ที่สร้าง

  		import Game from './models/Game.js'; //Schema จาก MongoDB
  
		GET Endpoint :/api/history ดึงประวัติการเล่นทั้งหมด

			app.get('/api/history', async (req, res) => {
			    try {
			        const games = await Game.find(); //ดึงข้อมูลทั้งหมดจาก Collection MongoDB
			        console.log('Fetched history:', games);
			        res.status(200).json(games); //ส่งค่ากลับไปยัง Front-End
			    } catch (error) {
			        console.error('Error fetching games:', error);
			        res.status(500).json({ message: 'Failed to fetch games', error });
			    }
			});
		
		POST Endpoint : /api/history ใช้บันทึกข้อมูลเกมที่เล่นจบแล้ว

			app.post('/api/history', async (req, res) => {
			    try {
			        const { date, boardSize, winner, moves, winningCells } = req.body; //รับค่าจาก Body
			        console.log('posttt' , req.body)

				//นำข้อมูลจาก Body เพื่อเก็บไปยัง Schema
			        const game = new Game({
			            date,
			            boardSize,
			            winner,
			            moves,
			            winningCells,
			        });
			
			        const savedGame = await game.save(); //นำข้อมูลที่เตรียมไว้จาก Schema ไป Save ที่ MongoDB
			        res.status(201).json({ message: 'Game saved successfully', game: savedGame }); //ส่งสถานะกลับไปยัง User
			    } catch (error) {
			        console.error('Error saving game:', error);
			        res.status(500).json({ message: 'Failed to save game', error });
			    }
			});



# 📌 Code Explanation Front-End (คร่าว ๆ)
ในส่วนของเกมหลักจะถูกจัดการในไฟล์ React component (เช่น Game.jsx) โดยใช้ React Hooks เช่น useState, useEffect ในการจัดการสถานะของเกม XO ดังนี้:

🔁 สถานะสำคัญ (State)

	boardSize – ขนาดกระดานที่ผู้เล่นกำหนดตอนเริ่มเกม (ขั้นต่ำ 3)
 	const [boardSize, setBoardSize] = useState(3);
	
	board – เก็บค่ากระดานทั้งหมด เช่น ['X', null, 'O', ...]
	const [board, setBoard] = useState([]);
 
	turn – ระบุว่าใครเป็นคนเล่นในรอบนั้น ('X' = ผู้เล่น, 'O' = บอท)
	const [turn, setTurn] = useState('X');
 
	gameOver – บอกสถานะว่าเกมจบแล้วหรือยัง
 	const [gameOver, setGameOver] = useState(false);
	
	winningCells – เก็บ index ช่องที่ชนะ เพื่อใส่สีพื้นหลัง
 	const [winningCells, setWinningCells] = useState([]); 
	
	moves – ลำดับการเดินหมาก สำหรับการบันทึกประวัติและ Replay
 	const [moves, setMoves] = useState([]);

	totalCells - จำนวน Boxs ที่ User กำหนด
  	const totalCells = boardSize * boardSize;

⚙️ ฟังก์ชันหลัก

	✅ checkStart()
	ใช้ SweetAlert2 แสดง Prompt ให้กรอกขนาดกระดานก่อนเริ่มเกม หากกรอกถูกต้องจะเริ่มสร้างกระดาน
	
	🎮 handleClick(index)
	เมื่อผู้เล่นคลิกช่องที่ยังว่างอยู่ จะใส่ 'X', บันทึกการเคลื่อนไหว, เปลี่ยนเทิร์นให้บอท
	
	🤖 botMove()
	บอทจะเลือกช่องว่างแบบสุ่มเพื่อใส่ 'O' โดยมีการ delay เล็กน้อยเพื่อความสมจริง
	
	🏁 checkWinner(board)
	เช็คทุกแนว (แนวตรง แนวนอน ทแยงหลัก-รอง) เพื่อดูว่ามีผู้ชนะหรือไม่
	
	หากชนะ: คืนค่า winner และ winningCells
	
	หากเสมอ: คืนค่า winner = "Draw"
	
	💾 saveGameHistory()
	บันทึกประวัติการเล่น (วันที่, ผู้ชนะ, ขนาด, ลำดับหมาก) ส่งไปยัง Back-End ผ่าน API
	
	🔄 handleReset()
	รีเซ็ตเกมใหม่ โดยไม่ออกไปหน้าแรก

 🧪 การทำงานโดยรวมใน useEffect
 
	ติดตามการเปลี่ยนแปลงของ board และ turn
	
	หากมีผู้ชนะหรือเสมอ → แสดง SweetAlert → บันทึกประวัติ → ถามว่าจะเล่นต่อหรือกลับ
	
	หากถึงเทิร์นของบอท → เรียก botMove()

# 📷 Screenshots Front-End ภายในเกม

1.หน้าแรกสามารถเลือกไปยังการ Replay หรือ กดเข้าเล่นได้

![image](https://github.com/user-attachments/assets/a59fc791-c909-4006-a6f4-36a32544b86f)

2.เมื่อกดเข้าเล่นจะสามารถเลือกจำนวนช่องได้ ขั้นต่ำคือขนาด 3*3

![image](https://github.com/user-attachments/assets/c324d905-8563-4a7d-9290-b014beeaee72)

3.เมื่อทำการเลือกขนาดตารางผู้เล่น(Player)จะเป็นผู้เริ่มก่อนโดยจะใช้สัญลักษณ์ X เมื่อทำการเลือกแล้วบอทจะเลือกอัตโนมัติ อีกทั้งยังสามารถกด Reset เพื่อเริ่มใหม่ได้

![image](https://github.com/user-attachments/assets/88555590-beed-45d2-893c-0e15fee0a03b)

4.เมื่อฝ่ายใด่ฝ่ายหนึ่งชนะหรือแพ้หรือเสมอระบบจะทำการบันทึกประวัติการเล่นเกมนั้นลงใน Back-End และจะถามในการเล่นครั้งต่อไป พร้อมทั้งกำหนดช่องตารางใหม่อีกครั้ง

![image](https://github.com/user-attachments/assets/409f5f17-0239-4e72-b33b-ea9969dc3bf7)

![image](https://github.com/user-attachments/assets/d95011cf-d158-4058-878f-a4fd87820bcc)

5.ในส่วนของประวัติการเล่นจะมี List แสดงประวัติด้านซ้ายและ Replay จะแสดงด้านขวาของจอ

![image](https://github.com/user-attachments/assets/d0257b6c-3b38-4d6a-a4a0-cca99a55bb88)

6.เมื่อทำการเลือกประวัติแล้วจะแสดงตารางประวัติการเล่น โดยจะสามารถกดดู Step by Step ได้

![image](https://github.com/user-attachments/assets/9e67a642-8825-413c-81e8-00552d759c92)







