<script setup lang="ts">
import { lol } from '@/data/lol'

const mainChampion = lol.champions[0]?.name
</script>

<template>
  <aside
    aria-labelledby="lol-titulo"
    class="mt-10 max-w-2xl rounded-md border border-muted/20 bg-surface p-6"
  >
    <p class="font-mono text-xs text-accent">Fuera del código</p>
    <h3 id="lol-titulo" class="mt-2 font-display text-xl font-bold tracking-tight text-text">
      {{ lol.game }}
    </h3>
    <p class="mt-2 text-muted">
      Juego como {{ lol.role }}<template v-if="mainChampion">, sobre todo con {{ mainChampion }}</template>.
      Ahora mismo en
      <strong class="font-semibold text-text">{{ lol.currentRank }}</strong> ({{ lol.server }}),
      con un {{ lol.winRate }} % de victorias en {{ lol.games }} partidas.
    </p>

    <div class="mt-6 grid gap-6 sm:grid-cols-[7rem_1fr] sm:items-start">
      <ul class="flex items-end gap-8 sm:flex-col sm:items-center sm:gap-5" aria-label="Rango y rol">
        <li class="flex flex-col items-center gap-2">
          <img
            src="/img/lol/diamond.webp"
            alt=""
            width="240"
            height="151"
            loading="lazy"
            decoding="async"
            class="h-auto w-24"
          />
          <span class="text-sm font-semibold text-text">{{ lol.currentRank }}</span>
        </li>
        <li class="flex flex-col items-center gap-2">
          <img
            src="/img/lol/support.webp"
            alt=""
            width="68"
            height="68"
            loading="lazy"
            decoding="async"
            class="size-10"
          />
          <span class="text-sm font-semibold capitalize text-text">{{ lol.role }}</span>
        </li>
      </ul>

      <table class="w-full text-sm tabular-nums">
        <caption class="sr-only">Campeones más jugados esta temporada</caption>
        <thead>
          <tr class="text-left text-xs text-muted">
            <th scope="col" class="pb-2 font-normal">Campeón</th>
            <th scope="col" class="pb-2 text-right font-normal">Partidas</th>
            <th scope="col" class="pb-2 text-right font-normal">Victorias</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="champion in lol.champions"
            :key="champion.name"
            class="border-t border-muted/15"
          >
            <th scope="row" class="py-2 text-left font-normal text-text">{{ champion.name }}</th>
            <td class="py-2 text-right text-muted">{{ champion.games }}</td>
            <td class="py-2 text-right text-muted">{{ champion.winRate }} %</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-5 text-sm text-muted">
      Datos de {{ lol.updatedAt }} ·
      <a
        :href="lol.profileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Perfil en op.gg
      </a>
    </p>

    <p lang="en" class="mt-3 text-xs text-muted">
      Mario Díaz González – Portfolio was created under Riot Games' "Legal Jibber Jabber" policy
      using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
    </p>
  </aside>
</template>