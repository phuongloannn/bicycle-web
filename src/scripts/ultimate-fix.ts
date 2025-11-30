import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function ultimateFix() {
  console.log('🚨 ULTIMATE FIX: Đang sửa database...');
  
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307, // 🔥 SỬA PORT THÀNH 3307
    username: 'root',
    password: 'admin', // 🔥 SỬA PASSWORD THÀNH admin
    database: 'sms_demo',
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Đã kết nối database thành công!');
    
    // Xóa users có email trống
    const result = await dataSource.query(`
      DELETE FROM users WHERE email = '' OR email IS NULL
    `);
    console.log(`✅ Đã xóa ${result.affectedRows} users có email trống`);
    
    await dataSource.destroy();
    console.log('🎉 FIX THÀNH CÔNG!');
    
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    console.log('💡 Kiểm tra:');
    console.log('   - MySQL có đang chạy trên port 3307 không?');
    console.log('   - Password "admin" có đúng không?');
    console.log('   - Database "sms_demo" có tồn tại không?');
  }
}

ultimateFix();