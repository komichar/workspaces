# **CI/CD Pipeline for Vite/React with AWS S3 + CloudFront**

## **1. CI/CD Strategy**

| **Branch**  | **Deployment Target**                  | **Purpose**                   |
| ----------- | -------------------------------------- | ----------------------------- |
| `master`    | Production (`S3 + CloudFront`)         | Deploy stable version         |
| `develop`   | Staging (`S3 + CloudFront`)            | Internal testing              |
| `feature/*` | Temporary Previews (`S3 + CloudFront`) | PR Testing (Feature Branches) |

### **Key Features**

- ✅ **Automated build & deploy on push**
- ✅ **Feature branch deployments to separate preview URLs**
- ✅ **CloudFront cache invalidation after deployment**
- ✅ **PR comments with preview links**

---

## **2. How This Works**

### **Master Branch (`master`)**

- Deploys to **Production** (`S3 + CloudFront`)
- Invalidates **CloudFront cache**
- Accessible at **`https://myapp.com`**

### **Staging Branch (`develop`)**

- Deploys to **Staging** (`S3 + CloudFront`)
- Invalidates **CloudFront cache**
- Accessible at **`https://staging.myapp.com`**

### **Feature Branches (`feature/*`)**

- Creates a unique **S3 bucket** for each branch
- Uploads build to **temporary S3 bucket**
- Posts **Preview URL in PR comments**

---

## **3. AWS IAM Setup for Secure Deployments**

1. **Create an IAM Role for GitHub Actions**

   - Attach policies: `AmazonS3FullAccess`, `CloudFrontFullAccess`
   - Use **OIDC Authentication** to avoid storing AWS secrets

2. **Assign Role to GitHub Actions**
   - Ensures **secure, token-based authentication** for deployments

---

## **4. Clean Up Preview Deployments**

Feature branch deployments create **temporary S3 buckets**. To clean up:

- Add a **GitHub Action job** that deletes the bucket when the PR is closed.
- AWS **Lifecycle Policies** can auto-delete unused preview buckets after **7 days**.

---

## **5. Summary**

- ✅ **Automated CI/CD for Production (`master` branch)**
- ✅ **Automated Staging (`develop` branch)**
- ✅ **Feature branch deployments with Preview Links**
- ✅ **CloudFront cache invalidation for instant updates**
- ✅ **Secure IAM role-based deployments**

This setup ensures **fast, automated, and scalable deployments** for your Vite/React app on **AWS S3 + CloudFront**. 🚀
