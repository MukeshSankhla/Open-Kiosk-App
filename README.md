# Open Kiosk 🏪
![Open Kiosk Demo](https://github.com/MukeshSankhla/Open-Kiosk/blob/main/images/GPH.gif)
An open-source, complete hardware + software kiosk solution designed for retail stores. Built with modern web technologies and integrated hardware components for a seamless point-of-sale experience.

## 🌟 Features

### Core Functionality
- **Complete POS System**: Add items, create bills, and manage inventory
- **Thermal Printing**: Integrated thermal printer support with fallback to system printer
- **Real-time Database**: All orders recorded with Firebase integration
- **Multi-language Support**: Tags can be entered in native language pronunciation
- **Multi-currency Support**: Flexible currency configuration
- **Voice Search**: Advanced search functionality with voice input
- **Offline Operation**: Runs locally - no hosting required

### Business Management
- **Sales Tracking**: Complete order history with date filtering
- **Report Generation**: Daily and custom timeframe reports (exportable as CSV)
- **Bill Reprinting**: Reprint any previous bill from order history
- **Tax Management**: Configurable tax rates and Tax ID setup
- **Admin Dashboard**: Real-time revenue and order statistics

### Hardware Integration
- **LattePanda MU**: Main computing unit
- **Seeed Xiao ESP32 S3**: Microcontroller for printer communication
- **Thermal Printer**: Direct printing via UART communication
- **Touch Screen**: Interactive user interface
- **Custom Enclosure**: 3D printed compact design

## 💻 Technology Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Google Firebase
- **Hardware Communication**: UART (ESP32 ↔ Thermal Printer)
- **Languages**: JavaScript, Python
- **Architecture**: Local-first application

## 🚀 Quick Start

### Method 1: Download Pre-built Release

1. **Download the latest release**
   ```
   Download Open-Kiosk.zip from the releases section
   ```

2. **Install Python**
   - Download and install Python from [python.org](https://python.org)

3. **Setup the application**
   - Extract the downloaded zip file
   - Edit `launch-kiosk.bat` and update the path to your extracted folder
   - Save the file

4. **Create desktop shortcut**
   - Right-click `launch-kiosk.bat` → Create shortcut
   - Right-click the shortcut → Properties → Change Icon (select from the same folder)
   - Rename shortcut to "Open Kiosk"
   - Copy to desktop/home screen

### Method 2: Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/MukeshSankhla/Open-Kiosk-App.git
   cd Open-Kiosk-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## ⚙️ Initial Setup

### 1. Firebase Configuration
- Create a free Google Firebase project
- Obtain your Firebase configuration keys
- Fill in the initial setup form with:
  - Store information
  - Firebase API strings
  - Database configuration

### 2. Store Configuration
- **Store Details**: Name, address, contact information
- **Tax Settings**: Tax ID number, tax percentage
- **Currency**: Select your preferred currency
- **Printer Setup**: Configure COM port for thermal printer

### 3. Hardware Setup (Optional)
- Connect ESP32 S3 to thermal printer via UART
- Configure COM port in admin settings
- Test thermal printer connection
- Enable/disable thermal printing as needed

## 📱 How It Works

### Order Flow
1. **Add Products**: Create and manage your inventory
2. **Build Cart**: Add items to cart with quantities
3. **Checkout**: Process payment and generate bill
4. **Print Receipt**: Automatic thermal printing (if configured)
5. **Save Order**: All transactions stored in database

## 🎯 Target Users

- **Small Retail Stores**: Independent shops and boutiques
- **Cafes & Restaurants**: Quick service establishments
- **Market Vendors**: Portable POS solution
- **Pop-up Shops**: Temporary retail locations
- **Any Business**: Requiring affordable POS system

## 🔍 Search Features

- **Text Search**: Find products by name or description
- **Voice Search**: Hands-free product lookup
- **Tag-based Search**: Native language pronunciation support
- **Real-time Filtering**: Instant results as you type

## 📊 Reporting Capabilities

- **Sales Analytics**: Track performance over time
- **Product Performance**: Identify best-selling items
- **Revenue Tracking**: Monitor daily/weekly/monthly income
- **Export Options**: CSV format for external analysis
- **Historical Data**: Complete order archive with search

## 🤝 Contributing
We welcome contributions! This is an open-source project designed to help small businesses worldwide.

## 📄 License
This project is open source and available under the MIT License.

## 🎉 Why Open Kiosk?

- **Affordable**: No monthly fees or licensing costs
- **Customizable**: Modify to fit your specific needs
- **Reliable**: Offline-first design ensures uptime
- **Future-proof**: Open source means continuous community development
- **Easy Setup**: Get running in minutes, not hours
- **Professional**: Feature-rich interface that customers will love

---

**Built with ❤️ for small businesses everywhere**

*Transform your store with Open Kiosk - the complete, affordable, and open-source POS solution.*
