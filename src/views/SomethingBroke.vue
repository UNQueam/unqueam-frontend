<template>
    <div id="broken">
		<div class="broken">
			<div class="broken-500">
				<h1>500</h1>
				<h2>Ups! Something went wrong</h2>
			</div>
      <RouterLink to="/" class="link">Homepage</RouterLink>
		</div>
	</div>
</template>

<script setup>
</script>

<style scoped>

#broken {
  position: relative;
  height: 100vh;
  background: #030005;
}

#broken .broken {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}

.broken {
  max-width: 767px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
}

.broken .broken-500 {
  position: relative;
  height: 180px;
  margin-bottom: 40px;
  z-index: -1;
}

.broken .broken-500 h1 {
  font-family: 'Montserrat', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50% , -50%);
      -ms-transform: translate(-50% , -50%);
          transform: translate(-50% , -50%);
  font-size: 224px;
  font-weight: 900;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: -12px;
  color: #030005;
  text-transform: uppercase;
  text-shadow: -1px -1px 0px #5c4444, 1px 1px 0px #ff005a;
  letter-spacing: -20px;
}


.broken .broken-500 h2 {
  font-family: 'Montserrat', sans-serif;
  position: absolute;
  left: 0;
  right: 0;
  top: 110px;
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0px 2px 0px #ff005a;
  letter-spacing: 13px;
  margin: 0;
}

.broken .link {
  font-family: 'Montserrat', sans-serif;
  display: inline-block;
  text-transform: uppercase;
  color: #ff005a;
  text-decoration: none;
  border: 2px solid;
  background: transparent;
  padding: 10px 40px;
  font-size: 14px;
  font-weight: 700;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}

.broken .link:hover {
  color: #ffffff;
}

@media only screen and (max-width: 767px) {
    .broken .broken-500 h2 {
        font-size: 24px;
    }
}

@media only screen and (max-width: 480px) {
  .broken .broken-500 h1 {
      font-size: 182px;
  }
}
</style>