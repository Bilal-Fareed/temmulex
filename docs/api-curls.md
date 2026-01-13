# API Endpoint cURL Examples

## 📝 Signup As Client
```bash
curl --location 'http://localhost:3001/v1/users/signup' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--form 'profile_picture=@"/C:/Users/Pictures/profile_picture.png"' \
--form 'user_type="client"' \
--form 'email="abc@gmail.com"' \
--form 'password="Abc123!!"' \
--form 'title="Mr"' \
--form 'first_name="First"' \
--form 'last_name="Demo"' \
--form 'country="USA"' \
--form 'dob="2026/12/01"' \
--form 'phone="123456789"'
```


## 📝 Signup As Freelancer
```bash
curl --location 'http://localhost:3001/v1/users/signup' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--form 'profile_picture=@"/C:/Users/Pictures/profile_picture.png"' \
--form 'user_type="freelancer"' \
--form 'email="freelancer@gmail.com"' \
--form 'password="Abc123!!"' \
--form 'title="Mr"' \
--form 'first_name="First"' \
--form 'last_name="Demo"' \
--form 'country="USA"' \
--form 'dob="2026/12/01"' \
--form 'phone="123456789"' \
--form 'languages="[\"dcf45f83-291d-413f-938f-2ce3ede51ee3\"]"' \
--form 'location="{\"lat\":0,\"lng\":0}"' \
--form 'services="[{\"serviceId\":\"f740660d-a46c-472a-b934-6323ac0728f5\",\"fixedPriceCents\":100,\"currency\":\"USD\"}]"' \
--form 'cv=@"/C:/Users/pdfs/cv.pdf"' \
--form 'dbs=@"/C:/Users/pdfs/dbs.pdf"'
```


## 📝 Send OTP
```bash
curl --location 'http://localhost:3001/v1/users/send-otp' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com"
}'
```


## 📝 Verify OTP
```bash
curl --location 'http://localhost:3001/v1/users/verify-otp' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com",
    "intent":"EMAIL_VERIFICATION",
    "otp": "0000"
}'
```


## 📝 Login as Client
```bash
curl --location 'http://localhost:3001/v1/users/login' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com",
    "password": "Abc123!!",
    "user_type":"client"
}'
```


## 📝 Login as Freelancer
```bash
curl --location 'http://localhost:3001/v1/users/login' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"freelancer@gmail.com",
    "password": "Abc123!!",
    "user_type":"freelancer"
}'
```


## 📝 Logout
```bash
curl --location --request POST 'http://localhost:3001/v1/users/logout' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--data ''
```