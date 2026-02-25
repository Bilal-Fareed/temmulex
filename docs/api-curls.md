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


## 📝 List Shoppers With Filters
```bash
curl --location --globoff 'http://localhost:3001/v1/users/top-rated/nearby?lat=-0.011994620971542783&lng=0.0001965761694590108&radius=500000&languages=a44f2482-76c4-4435-93af-64726771a8f8&languages=df56e5f8-d112-4a2a-9186-407bda3e39d4&services=40130a06-2a6a-400f-95f3-0e9b53be0c7c&services=d92c074d-e0e1-46bd-83df-120f5ed0b0db&price_range={%22starting_price%22%3A%200%2C%20%22ending_price%22%3A%2020}&search_text=shopper%27s%20name' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Delete Account
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/delete-account' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Forgot Password
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/forgot-password' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "password": "updatePassword@123"
}'
```


## 📝 Update Password
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/update-password' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "old_password": "oldPassword",
    "new_password": "newPassword"
}'
```


## 📝 Get My Profile
```bash
curl --location 'http://localhost:3001/v1/users/my-profile' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
```


## 📝 Update My Profile Details
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/update-profile' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Mr",
    "first_name": "First Name",
    "last_name": "Last Name",
    "phone": "123456789",
    "country": "USA",
    "dob": "2026/12/01",
    "profile_picture": "http://localhost:3001/v1/file/uploaded"
}'
```



## 📝 Get  My Profile Details
```bash
curl --location 'http://localhost:3001/v1/users/my-order?order_status=ongoing&page=1&limit=10' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```