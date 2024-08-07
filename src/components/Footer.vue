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
                    <a href="#" class="mg-gf-footer-legal-link text-reset">개인정보 처리방침</a>
                  </li>
                  <li class="list-inline-item">|</li>
                  <li class="list-inline-item">
                    <a href="#" class="mg-gf-footer-legal-link text-reset">이용약관</a>
                  </li>
                  <li class="list-inline-item">|</li>
                  <li class="list-inline-item">
                    <a href="#" class="mg-gf-footer-legal-link text-reset">이용안내</a>
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
                  <span class="footer-info-value text-black">{{ brandName }} | </span>
                  <span class="footer-info-field">대표자명 </span>
                  <span class="footer-info-value text-black">{{ ceoName }} | </span>
                  <span class="footer-info-field text-black">주소 </span>
                  <span class="footer-info-value text-black">{{ officeAddress }} | </span>
                  <span class="footer-info-field text-black">전화 </span>
                  <span class="footer-info-value text-black">{{ phoneNumber }} | </span>
                  <span class="footer-info-field text-black">사업자등록번호 </span>
                  <span class="footer-info-value text-black">{{ businessRegistrationNumber }} | </span>
                  <span class="footer-info-field text-black">통신판매업신고번호 </span>
                  <span class="footer-info-value text-black">{{ ecommerceRegistrationNumber }}</span>
                  <a href="#" class="footer-info-value-link text-black">[사업자정보확인]</a>
                  <span class="footer-info-field text-black"> | 개인정보보호책임자 </span>
                  <span class="footer-info-value text-black">{{ cpoName }} | </span>
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
    font-size: 13px;
    --bs-text-opacity: .5;
}

.mg-gf-footer-legal-links {
    font-size: 13px;
    margin-top: 3px;
    margin-left: 5px;
}

.mg-gf-footer-legal-link {
    text-decoration: none;
    
}

.footer-info-field {
    font-size: 11px;
    --bs-text-opacity: .8;
}

.footer-info-value {
    font-size: 11px;
    --bs-text-opacity: .5;
}

.footer-info-value-link {
    font-size: 11px;
    --bs-text-opacity: .8;
}

</style>
