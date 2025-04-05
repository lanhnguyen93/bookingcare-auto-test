# BookingCare Automation Testing

## Mô tả

Dự án tự động hóa kiểm thử cho hệ thống BookingCare, bao gồm kiểm thử giao diện, API, và kiểm thử chức năng

## Yêu cầu hệ thống

- Node.js >= 22.12.0
- Playwright >= 1.51.0
- MySQL >= 8.0

## Cài đặt

1. Clone repository:

   ```bash
   git clone https://github.com/lanhnguyen93/bookingcare-auto-test
   ```

2. Cài đặt dependence
   npm install

3. Cấu hình tệp .env
   Thông tin admin user để login vào các trang yêu cầu đăng nhập
   USER_EMAIL=
   USER_PASSWORD=

   Password mặc định khi tạo random data bằng API
   CREATE_DATA_PASSWORD=

   Thông tin chuyên khoa cho bài kiểm thử trang /detail-specialty
   SPECIALTY_ID=

   Thông tin doctor cho bài kiểm thử trang /detail-specialty
   DOCTOR_ID=

## Câu lệnh sử dụng

- Chạy toàn bộ bài kiểm thử
  npx playwright test

- Chạy bài kiểm thử api cho backend
  npm run api-test

- Chạy bài kiểm thử chức năng cho frontend
  npm run browser-test

- Chạy bài kiểm thử UI
  npm run visual-test

- Chạy bài kiểm thử UI trên applitools
  npm run eyes-test

## Cấu trúc dự án

src/
├── fixtures/               
│   └── base-test.ts        
|   └── auth-test.ts        
├── pages/                
│   ├── auth/             
│   │   └── loginPage.ts  
│   ├── home/             
│   │   ├── homePage.ts    
│   │   └── detailDoctorPage.ts 
│   └── system/            
│       ├── navigationBar.ts
│       └── manageSchedulePage.ts 
├── tests/                 
│   ├── api/              
│   │   └── specialties.spec.ts 
│   ├── browser/       
│   │   ├── home/    
│   │   │   └── specialtis.spec.ts 
│   │   └── detail-doctor/
│   │       └── schedule-infor.spec.ts 
│   └── visual/           
│       └── detail-doctor-page.spec.ts
├── utils/                 
│   ├── apiHelper.ts       
│   ├── doctorHelper.ts    
│   └── types.ts           
├── package.json           
├── playwright.config.ts  
├── .env                   
└── README.md              
