<template>
  <div class="container" id="globalfooter">
    <footer class="footer" id="mg-global-footer">
      <div class="container">
        <section class="mt-4" id="mg-gf-footer-legal">
          <div class="row">
            <div class="container d-flex justify-content-between">
              <div class="footer-legal-copyright d-flex">
                <a href="/" id="mg-gf-footer-logo">
                    <img :src="brandLogoURL" alt="Brand Logo" class="img-fluid" id="mg-gf-footer-logo-img">
                </a>
                <p class="ms-2 text-black footer-legal-copyright">Copyright © 2024 Muserium Glass. All rights reserved. Hosting by AWS</p>
              </div>
              <div class="footer-legal-links d-flex">
                <ul class="mg-gf-footer-legal-links list-inline">
                  <li class="list-inline-item">
                    <a href="#" class="mg-gf-footer-legal-link">개인정보 처리방침 </a>|
                  </li>
                  <li class="list-inline-item">
                    <a href="#" class="mg-gf-footer-legal-link">이용약관 </a>|
                  </li>
                  <li class="list-inline-item">
                    <a href="#" class="mg-gf-footer-legal-link">이용안내</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="mg-gf-footer-info">
          <div class="row align-items-center">
            <div class="col-md">
              <div class="footer-info">
                <p id="brand-name">
                  <span class="footer-info-value ">{{ brandName }}</span> |
                  <span class="footer-info-field">대표자명 </span>
                  <span class="footer-info-value ">{{ ceoName }}</span> | 
                  <span class="footer-info-field ">주소 </span>
                  <span class="footer-info-value ">{{ officeAddress }}</span> |
                  <span class="footer-info-field ">전화 </span>
                  <span class="footer-info-value ">{{ phoneNumber }}</span> |
                  <span class="footer-info-field ">사업자등록번호 </span>
                  <span class="footer-info-value ">{{ businessRegistrationNumber }}</span> | 
                  <span class="footer-info-field ">통신판매업신고번호 </span>
                  <span class="footer-info-value ">{{ ecommerceRegistrationNumber }}</span>
                  <a href="#" class="footer-info-value-link "> [사업자정보확인]</a> |
                  <span class="footer-info-field "> 개인정보보호책임자 </span>
                  <span class="footer-info-value ">{{ cpoName }}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
      brandName: process.env.VUE_APP_BRAND_NAME,
      ceoName: process.env.VUE_APP_CEO_NAME,
      officeAddress: process.env.VUE_APP_OFFICE_ADDRESS,
      phoneNumber: process.env.VUE_APP_PHONE_NUMBER,
      businessRegistrationNumber: process.env.VUE_APP_BUSINESS_REGISTRATION_NUMBER,
      ecommerceRegistrationNumber: process.env.VUE_APP_ECOMMERCE_REGISTRATION_NUMBER,
      cpoName: process.env.VUE_APP_CPO_NAME
    };
  },
};
</script>

<style scoped>
#mg-gf-footer-logo-img {
    max-width: 50px;
}
.footer-legal-copyright {
    font-size: 0.8rem;
    --bs-text-opacity: .5;
}

.mg-gf-footer-legal-links {
    font-size: 0.8rem;
}

.list-inline-item {
    color: #888888;
}

.mg-gf-footer-legal-link {
    text-decoration: none;
    color: #888888;
}

.mg-gf-footer-legal-link:hover {
    color: #000000;
    text-decoration: underline;
}

.footer-info {
    font-size: 0.7rem;
    color: #888888;
}

.footer-info-field {
    color: #111111;
    font-size: 0.7rem;
}

.footer-info-value {
    color: #888888;
    font-size:  0.7rem;
}

.footer-info-value-link {
    text-decoration: none;
    color: #888888;
    font-size:  0.7rem;
    --bs-text-opacity: .8;
}

.footer-info-value-link:hover {
    color: #000000;
    text-decoration: underline;
}

</style>
