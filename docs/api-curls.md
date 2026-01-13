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
--form 'password="aBc123@\!"' \
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
