<template>
  <div class="pt-[80px] w-[90%] md:w-[80%] xl2:w-[1200px] 2xl:w-[63%] m-auto">
    <div class="flex justify-between flex-col sm:flex-row items-start sm:items-center sm:pb-[60px]">
      <div class="flex flex-col items-start md:flex-row md:items-center">
        <!-- <img
          src="https://neex.com/assets/logo-Cbm4qUgd.svg"
          class="h-[36px] md:h-[46px] lg:me-[40px] cursor-pointer"
          alt="logo"
        /> -->
        <span dir="ltr" class="text-black dark:!text-white font-Inter font-[400] hidden xl2:block">© {{
          t('footer.allRights') }}</span>
      </div>
      <!-- <div class="flex hidden sm:flex">
        <a
          href="https://www.linkedin.com/company/neexglobal"
          target="_blank"
          class="block w-[24px] h-[24px] ms-[24px] first:ms-[0]"
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Social%20Icons'%20clip-path='url(%23clip0_1580_422)'%3e%3cpath%20id='Vector'%20d='M22.2184%200H1.76687C0.787183%200%20-0.00500488%200.773438%20-0.00500488%201.72969V22.2656C-0.00500488%2023.2219%200.787183%2024%201.76687%2024H22.2184C23.1981%2024%2023.995%2023.2219%2023.995%2022.2703V1.72969C23.995%200.773438%2023.1981%200%2022.2184%200ZM7.11531%2020.4516H3.55281V8.99531H7.11531V20.4516ZM5.33406%207.43438C4.19031%207.43438%203.26687%206.51094%203.26687%205.37187C3.26687%204.23281%204.19031%203.30937%205.33406%203.30937C6.47312%203.30937%207.39656%204.23281%207.39656%205.37187C7.39656%206.50625%206.47312%207.43438%205.33406%207.43438ZM20.4466%2020.4516H16.8887V14.8828C16.8887%2013.5562%2016.8653%2011.8453%2015.0372%2011.8453C13.1856%2011.8453%2012.9044%2013.2937%2012.9044%2014.7891V20.4516H9.35125V8.99531H12.7637V10.5609H12.8106C13.2841%209.66094%2014.4466%208.70938%2016.1762%208.70938C19.7809%208.70938%2020.4466%2011.0813%2020.4466%2014.1656V20.4516Z'%20fill='%230F1022'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1580_422'%3e%3crect%20width='24'%20height='24'%20fill='white'%20transform='translate(-0.00500488)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
            class="w-[24px]"
            alt="logo"
          />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61563593536076"
          target="_blank"
          class="block w-[24px] h-[24px] ms-[24px] first:ms-[0]"
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Social%20Icons'%20clip-path='url(%23clip0_1580_426)'%3e%3cpath%20id='Vector'%20d='M12%200C5.37264%200%200%205.37264%200%2012C0%2017.6275%203.87456%2022.3498%209.10128%2023.6467V15.6672H6.62688V12H9.10128V10.4198C9.10128%206.33552%2010.9498%204.4424%2014.9597%204.4424C15.72%204.4424%2017.0318%204.59168%2017.5685%204.74048V8.06448C17.2853%208.03472%2016.7933%208.01984%2016.1822%208.01984C14.2147%208.01984%2013.4544%208.76528%2013.4544%2010.703V12H17.3741L16.7006%2015.6672H13.4544V23.9122C19.3963%2023.1946%2024.0005%2018.1354%2024.0005%2012C24%205.37264%2018.6274%200%2012%200Z'%20fill='%230F1022'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1580_426'%3e%3crect%20width='24'%20height='24'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
            class="w-[24px]"
            alt="logo"
          />
        </a>
        <a
          href="https://www.instagram.com/neex_global"
          target="_blank"
          class="block w-[24px] h-[24px] ms-[24px] first:ms-[0]"
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Social%20Icons'%20clip-path='url(%23clip0_1580_432)'%3e%3cpath%20id='Vector'%20d='M12%202.16094C15.2063%202.16094%2015.5859%202.175%2016.8469%202.23125C18.0188%202.28281%2018.6516%202.47969%2019.0734%202.64375C19.6313%202.85938%2020.0344%203.12188%2020.4516%203.53906C20.8734%203.96094%2021.1313%204.35938%2021.3469%204.91719C21.5109%205.33906%2021.7078%205.97656%2021.7594%207.14375C21.8156%208.40937%2021.8297%208.78906%2021.8297%2011.9906C21.8297%2015.1969%2021.8156%2015.5766%2021.7594%2016.8375C21.7078%2018.0094%2021.5109%2018.6422%2021.3469%2019.0641C21.1313%2019.6219%2020.8687%2020.025%2020.4516%2020.4422C20.0297%2020.8641%2019.6313%2021.1219%2019.0734%2021.3375C18.6516%2021.5016%2018.0141%2021.6984%2016.8469%2021.75C15.5813%2021.8062%2015.2016%2021.8203%2012%2021.8203C8.79375%2021.8203%208.41406%2021.8062%207.15313%2021.75C5.98125%2021.6984%205.34844%2021.5016%204.92656%2021.3375C4.36875%2021.1219%203.96563%2020.8594%203.54844%2020.4422C3.12656%2020.0203%202.86875%2019.6219%202.65313%2019.0641C2.48906%2018.6422%202.29219%2018.0047%202.24063%2016.8375C2.18438%2015.5719%202.17031%2015.1922%202.17031%2011.9906C2.17031%208.78438%202.18438%208.40469%202.24063%207.14375C2.29219%205.97187%202.48906%205.33906%202.65313%204.91719C2.86875%204.35938%203.13125%203.95625%203.54844%203.53906C3.97031%203.11719%204.36875%202.85938%204.92656%202.64375C5.34844%202.47969%205.98594%202.28281%207.15313%202.23125C8.41406%202.175%208.79375%202.16094%2012%202.16094ZM12%200C8.74219%200%208.33438%200.0140625%207.05469%200.0703125C5.77969%200.126563%204.90313%200.332812%204.14375%200.628125C3.35156%200.9375%202.68125%201.34531%202.01563%202.01562C1.34531%202.68125%200.9375%203.35156%200.628125%204.13906C0.332812%204.90313%200.126563%205.775%200.0703125%207.05C0.0140625%208.33437%200%208.74219%200%2012C0%2015.2578%200.0140625%2015.6656%200.0703125%2016.9453C0.126563%2018.2203%200.332812%2019.0969%200.628125%2019.8563C0.9375%2020.6484%201.34531%2021.3188%202.01563%2021.9844C2.68125%2022.65%203.35156%2023.0625%204.13906%2023.3672C4.90313%2023.6625%205.775%2023.8687%207.05%2023.925C8.32969%2023.9812%208.7375%2023.9953%2011.9953%2023.9953C15.2531%2023.9953%2015.6609%2023.9812%2016.9406%2023.925C18.2156%2023.8687%2019.0922%2023.6625%2019.8516%2023.3672C20.6391%2023.0625%2021.3094%2022.65%2021.975%2021.9844C22.6406%2021.3188%2023.0531%2020.6484%2023.3578%2019.8609C23.6531%2019.0969%2023.8594%2018.225%2023.9156%2016.95C23.9719%2015.6703%2023.9859%2015.2625%2023.9859%2012.0047C23.9859%208.74688%2023.9719%208.33906%2023.9156%207.05938C23.8594%205.78438%2023.6531%204.90781%2023.3578%204.14844C23.0625%203.35156%2022.6547%202.68125%2021.9844%202.01562C21.3188%201.35%2020.6484%200.9375%2019.8609%200.632812C19.0969%200.3375%2018.225%200.13125%2016.95%200.075C15.6656%200.0140625%2015.2578%200%2012%200Z'%20fill='%230F1022'/%3e%3cpath%20id='Vector_2'%20d='M12%205.83594C8.59688%205.83594%205.83594%208.59688%205.83594%2012C5.83594%2015.4031%208.59688%2018.1641%2012%2018.1641C15.4031%2018.1641%2018.1641%2015.4031%2018.1641%2012C18.1641%208.59688%2015.4031%205.83594%2012%205.83594ZM12%2015.9984C9.79219%2015.9984%208.00156%2014.2078%208.00156%2012C8.00156%209.79219%209.79219%208.00156%2012%208.00156C14.2078%208.00156%2015.9984%209.79219%2015.9984%2012C15.9984%2014.2078%2014.2078%2015.9984%2012%2015.9984Z'%20fill='%230F1022'/%3e%3cpath%20id='Vector_3'%20d='M19.8469%205.59238C19.8469%206.38926%2019.2%207.03145%2018.4078%207.03145C17.6109%207.03145%2016.9688%206.38457%2016.9688%205.59238C16.9688%204.79551%2017.6156%204.15332%2018.4078%204.15332C19.2%204.15332%2019.8469%204.8002%2019.8469%205.59238Z'%20fill='%230F1022'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1580_432'%3e%3crect%20width='24'%20height='24'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
            class="w-[24px]"
            alt="logo"
          />
        </a>
      </div> -->
    </div>

    <!-- <span
      class="text-black dark:!text-white font-Inter font-[400] md:text-[12px]/[normal] hidden xl2:block mb-[60px]"
      >{{ t('footer.footers') }}</span
    >

    <div data-v-4803f466="" class="sm:py-[60px] sm:border-y border-black-02 dark:!border-white-20">
      <ul data-v-4803f466="" class="flex flex-wrap ul">
        <li data-v-4803f466="" class="w-[100%] sm:w-[50%] lg:w-[25%] shrink-0 mt-[36px] sm:mt-[0]">
          <h2
            data-v-4803f466=""
            class="text-black  text-[16px] font-[500] leading-[36px]"
          >
            {{ t('route.company') }}
          </h2>
          <ul data-v-4803f466="" class="sonUl">
            <li data-v-4803f466="" class="mt-[10px] me-[10px]">
              <h2 data-v-4803f466="" class="text-primary text-[16px] leading-[20px] font-Inter">
                {{ t('route.aboutNeex') }}
              </h2>

              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/whyChooseNeex" class="">
                  {{ t('route.whyNeex') }}
                </router-link>
              </p>

              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/achievements" class="">
                  {{ t('route.achievements') }}
                </router-link>
              </p>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/licensesAndRegulations" class="">
                  {{ t('route.licensesAndRegulations') }}
                </router-link>
              </p>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/clientFundsInsurance" class="">
                  {{ t('route.clientFundsInsurance') }}
                </router-link>
              </p>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/securityOfFunds" class="">
                  {{ t('route.securityOfFunds') }}
                </router-link>
              </p>
            </li>
          </ul>
        </li>

        <li data-v-4803f466="" class="w-[100%] sm:w-[50%] lg:w-[25%] shrink-0 mt-[36px] sm:mt-[0]">
          <h2
            data-v-4803f466=""
            class="text-black  text-[16px] font-[500] leading-[36px]"
          >
            {{ t('route.tools') }}
          </h2>
          <ul data-v-4803f466="" class="sonUl">
            <li data-v-4803f466="" class="mt-[10px] me-[10px]">
              <h2 data-v-4803f466="" class="text-primary text-[16px] leading-[20px] font-Inter">
                {{ t('route.resources') }}
              </h2>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/cyberSecurityWarning" class="">
                  {{ t('route.cyberSecurityWarning') }}
                </router-link>
              </p>
            </li>
          </ul>
        </li>

        <li data-v-4803f466="" class="w-[100%] sm:w-[50%] lg:w-[25%] shrink-0 mt-[36px] sm:mt-[0]">
          <h2
            data-v-4803f466=""
            class="text-black  text-[16px] font-[500] leading-[36px]"
          >
            {{ t('route.platforms') }}
          </h2>
          <ul data-v-4803f466="" class="sonUl">
            <li data-v-4803f466="" class="mt-[10px] me-[10px]">
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                {{ t('route.allPlatforms') }}
              </p>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/mt4" class="">
                  {{ t('route.metaTrader4') }}
                </router-link>
              </p>
              <p
                data-v-4803f466=""
                class="text-Gray-700 -50 font-[400] mt-[10px] text-[16px] leading-[20px] font-Inter cursor-pointer"
              >
                <router-link to="/mt5" class="">
                  {{ t('route.metaTrader5') }}
                </router-link>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="pt-[60px] m-auto">
      <div
        v-for="(item, index) in 6"
        :key="index"
        class="text-gray-700 leading-[24px] dark:!text-gray-300 mb-[24px] font-Inter tracking-[0.16px] text-[16px]"
        v-html="t(`footer.risk${item}`)"
      ></div>
    </div>

    <div class="h-10"></div>

    <div class="pb-[60px] pt-[20px] sm:pt-[40px] sm:border-t border-black-02 dark:!border-white-20">
      <ul class="flex flex-col xl2:mb-[40px] sm:flex-row flex-wrap">
        <li class="me-[24px] last:me-[0] pb-[24px] last:mb-[0]">
          <a
            class="leading-[17px] text-gray-700 dark:!text-gray-200 cursor-pointer font-Inter font-[400]"
            href="https://assets.cdn.neex.com/static/policy/zh-CN/PrivacyAndSecurityPolicy.pdf"
            target="_blank"
            >{{ t('footer.privacyPolicy') }}</a
          >
        </li>
        <li class="me-[24px] last:me-[0] pb-[24px] last:mb-[0]">
          <a
            class="leading-[17px] text-gray-700 dark:!text-gray-200 cursor-pointer font-Inter font-[400]"
            href="https://assets.cdn.neex.com/static/policy/zh-CN/ClientAgreement.pdf"
            target="_blank"
            >{{ t('footer.clientAgreement') }}</a
          >
        </li>
        <li class="me-[24px] last:me-[0] pb-[24px] last:mb-[0]">
          <a
            class="leading-[17px] text-gray-700 dark:!text-gray-200 cursor-pointer font-Inter font-[400]"
            href="https://assets.cdn.neex.com/static/policy/zh-CN/NEEXTermsOfUse.pdf"
            target="_blank"
            >{{ t('footer.termsOfUse') }}</a
          >
        </li>
        <li class="me-[24px] last:me-[0] pb-[24px] last:mb-[0]">
          <a
            class="leading-[17px] text-gray-700 dark:!text-gray-200 cursor-pointer font-Inter font-[400]"
            href="https://assets.cdn.neex.com/static/policy/zh-CN/CookiesPolicy.pdf"
            target="_blank"
            >{{ t('footer.cookiesPolicy') }}</a
          >
        </li>
        <li class="me-[24px] last:me-[0] pb-[24px] last:mb-[0]">
          <a
            class="leading-[17px] text-gray-700 dark:!text-gray-200 cursor-pointer font-Inter font-[400]"
            href="https://assets.cdn.neex.com/static/policy/zh-CN/RiskWarningDisclosure.pdf"
            target="_blank"
            >{{ t('footer.riskDisclosure') }}</a
          >
        </li>
      </ul>
      <div
        class="text-black dark:!text-white font-Inter font-[400] block xl2:hidden sm:text-center"
      >
        {{ t('footer.allRights') }}
      </div>
      <div
        class="mt-[20px] text-black dark:!text-white font-Inter text-[14px]/[normal] font-[400] block xl2:hidden sm:text-center tracking-[0.2px]"
      >
        {{ t('footer.footers') }}
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.sonUl {
  margin-right: 10px;
}
</style>